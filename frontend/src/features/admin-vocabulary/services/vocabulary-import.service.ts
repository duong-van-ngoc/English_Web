import JSZip from "jszip";
import * as XLSX from "xlsx";
import { api } from "@/lib/api";
import type { VocabularyImportBatch, ImportRow } from "../types/vocabulary-import.type";

const VALID_POS = ["noun", "verb", "adjective", "adverb", "phrase", "noun phrase", "verb phrase", "phrasal verb"];

// Accepted image extensions inside the ZIP images/ folder
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Map Vietnamese labels to normalized partOfSpeech codes
const getPosCode = (posText: string): string => {
  const normalized = (posText || "").trim().toLowerCase();
  // Check phrases first since they contain word patterns like "noun" or "verb"
  if (normalized.includes("cụm danh từ") || normalized === "noun phrase" || normalized === "np") return "noun phrase";
  if (
    normalized.includes("cụm động từ") ||
    normalized.includes("phrasal verb") ||
    normalized === "verb phrase" ||
    normalized === "vp" ||
    normalized === "pv"
  ) {
    return "phrasal verb";
  }
  if (normalized.includes("danh từ") || normalized === "n" || normalized === "noun") return "noun";
  if (normalized.includes("động từ") || normalized === "v" || normalized === "verb") return "verb";
  if (normalized.includes("tính từ") || normalized === "adj" || normalized === "adjective") return "adjective";
  if (normalized.includes("trạng từ") || normalized === "adv" || normalized === "adverb") return "adverb";
  if (normalized.includes("cụm từ") || normalized === "phrase") return "phrase";
  return normalized;
};

/** Build a word→File map from the images/ directory inside a ZIP */
async function extractImagesFromZip(zip: JSZip): Promise<Map<string, File>> {
  const imageMap = new Map<string, File>();

  const imageEntries = Object.entries(zip.files).filter(([path, entry]) => {
    if (entry.dir) return false;
    const lowerPath = path.toLowerCase();
    // Accept files in images/ folder (any depth) or root-level image files
    const isImage = IMAGE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
    return isImage;
  });

  await Promise.all(
    imageEntries.map(async ([path, entry]) => {
      try {
        const blob = await entry.async("blob");
        // Derive word key from filename (strip path + extension)
        const filename = path.split("/").pop() ?? path;
        const ext = "." + filename.split(".").pop()!;
        const wordKey = filename.slice(0, filename.length - ext.length).toLowerCase().trim();
        const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg"
          : ext === ".png" ? "image/png"
          : "image/webp";
        const file = new File([blob], filename, { type: mimeType });
        imageMap.set(wordKey, file);
      } catch {
        // Skip unreadable images
      }
    })
  );

  return imageMap;
}

/** Parse CSV/XLSX bytes into row arrays */
function parseSheetData(buffer: ArrayBuffer, fileName: string): any[][] {
  let workbook: XLSX.WorkBook;
  if (fileName.toLowerCase().endsWith(".csv")) {
    const decoder = new TextDecoder("utf-8");
    const csvText = decoder.decode(buffer);
    workbook = XLSX.read(csvText, { type: "string" });
  } else {
    workbook = XLSX.read(buffer, { type: "array" });
  }
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
}

export type ImportProgressCallback = (uploaded: number, total: number) => void;

export const vocabularyImportService = {
  /**
   * uploadAndValidate — accepts CSV, XLSX, or ZIP (CSV + images/ folder).
   * Returns a VocabularyImportBatch stored in sessionStorage.
   */
  uploadAndValidate: async (topicId: string, file: File): Promise<VocabularyImportBatch> => {
    const isZip = file.name.toLowerCase().endsWith(".zip");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          if (!data) throw new Error("Không thể đọc dữ liệu tệp tin.");

          let rowsData: any[][];
          let imageMap = new Map<string, File>();
          let csvFileName = file.name;

          if (isZip) {
            // --- Extract ZIP ---
            const zip = await JSZip.loadAsync(data as ArrayBuffer);

            // Find the first .csv or .xlsx file in the ZIP
            const dataEntry = Object.entries(zip.files).find(([path, entry]) => {
              if (entry.dir) return false;
              const lower = path.toLowerCase();
              return lower.endsWith(".csv") || lower.endsWith(".xlsx") || lower.endsWith(".xls");
            });

            if (!dataEntry) {
              throw new Error("Không tìm thấy file CSV hoặc Excel trong ZIP. Hãy đặt file dữ liệu ở thư mục gốc.");
            }

            const [dataPath, dataZipEntry] = dataEntry;
            csvFileName = dataPath.split("/").pop() ?? dataPath;
            const csvBuffer = await dataZipEntry.async("arraybuffer");
            rowsData = parseSheetData(csvBuffer, csvFileName);

            // Extract images
            imageMap = await extractImagesFromZip(zip);
          } else {
            // --- Regular CSV / Excel ---
            rowsData = parseSheetData(data as ArrayBuffer, file.name);
          }

          if (rowsData.length <= 1) {
            throw new Error("Tệp tin trống hoặc không chứa dòng dữ liệu từ vựng (bỏ qua dòng tiêu đề).");
          }

          const importRows: ImportRow[] = [];
          let validCount = 0;
          let invalidCount = 0;
          let rowsWithImages = 0;

          for (let i = 1; i < rowsData.length; i++) {
            const row = rowsData[i];
            if (!row || row.length === 0) continue;

            const rawWord = String(row[0] || "").trim();
            const rawPhonetic = String(row[1] || "").trim();
            const rawMeaning = String(row[2] || "").trim();
            const rawPos = String(row[3] || "").trim();
            const rawExample = String(row[4] || "").trim();
            const rawExampleVi = String(row[5] || "").trim();

            // Skip fully empty rows
            if (!rawWord && !rawPhonetic && !rawMeaning && !rawPos && !rawExample && !rawExampleVi) continue;

            const errors: string[] = [];
            if (!rawWord) errors.push("Từ vựng không được để trống");
            if (!rawMeaning) errors.push("Nghĩa tiếng Việt không được để trống");
            if (!rawPos) {
              errors.push("Từ loại không được để trống");
            } else {
              const posCode = getPosCode(rawPos);
              if (!VALID_POS.includes(posCode)) {
                errors.push(
                  `Từ loại '${rawPos}' không hợp lệ (chấp nhận: noun, verb, adjective, adverb, phrase, noun phrase, phrasal verb)`
                );
              }
            }

            const isValid = errors.length === 0;
            if (isValid) validCount++;
            else invalidCount++;

            // Match image by word key (case-insensitive)
            const wordKey = rawWord.toLowerCase().trim();
            const imageFile = imageMap.get(wordKey);
            let imagePreviewUrl: string | undefined;
            if (imageFile) {
              imagePreviewUrl = URL.createObjectURL(imageFile);
              rowsWithImages++;
            }

            importRows.push({
              index: i,
              word: rawWord,
              phonetic: rawPhonetic || undefined,
              meaning: rawMeaning,
              partOfSpeech: getPosCode(rawPos),
              example: rawExample || undefined,
              exampleVi: rawExampleVi || undefined,
              isValid,
              errors,
              imageFile,
              imagePreviewUrl,
            });
          }

          const batchId = "batch-" + Math.random().toString(36).substr(2, 9);
          const batch: VocabularyImportBatch = {
            id: batchId,
            fileName: file.name,
            fileSize: file.size,
            totalRows: importRows.length,
            validRows: validCount,
            invalidRows: invalidCount,
            rowsWithImages,
            status: "VALIDATED",
            rows: importRows,
            createdAt: new Date().toISOString(),
          };

          // Cache in sessionStorage (note: File objects not serializable — stored in module-level map)
          if (typeof window !== "undefined") {
            // Store serializable part
            const serializableRows = importRows.map(({ imageFile, imagePreviewUrl, ...rest }) => rest);
            sessionStorage.setItem(
              `vocab_import_batch_${batchId}`,
              JSON.stringify({ topicId, batch: { ...batch, rows: serializableRows } })
            );
            // Store image files in memory map (within this module)
            imageStore.set(batchId, imageMap);
          }

          resolve(batch);
        } catch (err: any) {
          console.error("Import parse error:", err);
          reject(new Error(err.message || "Lỗi khi đọc file. Vui lòng kiểm tra lại cấu trúc file mẫu."));
        }
      };

      reader.onerror = () => reject(new Error("Lỗi đọc file."));
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * commitImport — uploads images then creates vocabulary records.
   * Calls onProgress(uploaded, total) after each image upload.
   */
  commitImport: async (
    batchId: string,
    importRows: ImportRow[], // pass the in-memory rows that still have imageFile
    onProgress?: ImportProgressCallback
  ): Promise<void> => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(`vocab_import_batch_${batchId}`);
    if (!stored) throw new Error("Không tìm thấy dữ liệu import đã kiểm tra.");

    const { topicId } = JSON.parse(stored) as { topicId: string };
    const validRows = importRows.filter((r) => r.isValid);
    const rowsWithImages = validRows.filter((r) => r.imageFile);

    let uploadedCount = 0;
    const totalImages = rowsWithImages.length;

    // Step 1 — Upload all images first, collect word→imageUrl
    const imageUrlMap = new Map<string, string>();
    for (const row of rowsWithImages) {
      try {
        const asset = await api.uploadFile("IMAGE", row.imageFile!);
        imageUrlMap.set(row.word, asset.url);
      } catch (err) {
        console.error(`Failed to upload image for "${row.word}":`, err);
      }
      uploadedCount++;
      onProgress?.(uploadedCount, totalImages);
    }

    // Step 2 — Create vocabulary records
    await Promise.all(
      validRows.map(async (row) => {
        try {
          const payload: Record<string, any> = {
            word: row.word,
            meaning: row.meaning,
            partOfSpeech: row.partOfSpeech,
          };
          if (row.phonetic) payload.phonetic = row.phonetic;
          if (row.example) payload.example = row.example;
          if (row.exampleVi) payload.exampleVi = row.exampleVi;
          const imageUrl = imageUrlMap.get(row.word);
          if (imageUrl) payload.imageUrl = imageUrl;

          await api.createTopicWord(topicId, payload);
        } catch (err) {
          console.error(`Failed to import word "${row.word}":`, err);
        }
      })
    );

    // Cleanup
    sessionStorage.removeItem(`vocab_import_batch_${batchId}`);
    imageStore.delete(batchId);

    // Revoke preview object URLs
    validRows.forEach((r) => {
      if (r.imagePreviewUrl) URL.revokeObjectURL(r.imagePreviewUrl);
    });
  },
};

/** Module-level image file store (survives re-renders, cleared after commit) */
const imageStore = new Map<string, Map<string, File>>();
