# Roadmap Frontend Production-Ready với Next.js App Router và TypeScript

## Mục lục

- Chẩn đoán roadmap hiện tại
- Khung tư duy production-ready
- Roadmap theo level
- Project structure và data flow
- Learning path, mini project và checklist
- Coding standards, lỗi thường gặp và giới hạn phân tích

## Chẩn đoán roadmap hiện tại

Tôi đã đọc cả hai tài liệu bạn gửi. Roadmap Next.js hiện tập trung vào App Router cơ bản, `page.tsx`, `layout.tsx`, component, props, `use client`, dynamic route, fake data, `map`, `find`, Tailwind cơ bản, form UI đơn giản, loading/empty state, cấu trúc thư mục tối giản, và một mini project phase đầu. Roadmap TypeScript hiện tập trung vào primitive types, function type, interface, props typing, array object type, optional type, union type, typing cho `useState`, API response, `any`, `unknown`, type alias, readonly, record, generic cơ bản, cùng mindset “đặt câu hỏi về data structure” thay vì copy type. Nói ngắn gọn: hai file này **đủ tốt cho mức intern mới bắt đầu**, đặc biệt ở chỗ dễ hiểu, ít hàn lâm, và bám vào một project học tiếng Anh cụ thể. fileciteturn0file0L7-L18 fileciteturn0file0L40-L103 fileciteturn0file0L169-L211 fileciteturn0file0L254-L284 fileciteturn0file0L436-L446 fileciteturn0file0L557-L596 fileciteturn0file1L21-L175 fileciteturn0file1L199-L258 fileciteturn0file1L263-L398 fileciteturn0file1L475-L534

Điểm mạnh lớn nhất của roadmap hiện tại là nó đang dạy theo cách “cầm tay chỉ việc”, rất hợp với intern: mỗi block đều nhỏ, gọn, có ví dụ cụ thể, và có checklist cuối phase. Điều này đúng với mục tiêu “giải thích theo flow thực tế” của bạn, vì người mới cần nhìn thấy dữ liệu đi từ file fake data sang page, rồi sang card, rồi render ra UI. Đó là một bước đệm tốt trước khi nói tới API, auth hay architecture. fileciteturn0file0L270-L338 fileciteturn0file0L450-L484 fileciteturn0file1L483-L489

Nhưng khi đối chiếu với chuẩn Next.js App Router hiện đại, roadmap này **mới chỉ chạm phần “UI tutorial” chứ chưa chạm phần “product engineering”**. Tài liệu chính thức của Next.js hiện xem `page`, `layout`, route segments, nested routes, Server Components mặc định, `loading.js`, `error.js`, `not-found.js`, data fetching, streaming, Route Handlers, authentication, forms với Server Actions, production checklist, testing, data security, environment variables, deployment, và TypeScript plugin là những mảnh ghép quan trọng của một app thật. Bạn đang có phần đầu rất ổn, nhưng đang thiếu gần như toàn bộ nửa sau của vòng đời sản phẩm. citeturn22view0turn22view1turn22view4turn14view0turn14view6turn14view5turn14view7turn16view0turn15view1turn17view1turn27view0turn13view0turn23view1

Cụ thể, có bảy khoảng trống lớn.

Thứ nhất, roadmap hiện tại mới dừng ở `page.tsx`, `layout.tsx`, route tĩnh và dynamic route, nhưng chưa dạy đầy đủ **routing theo App Router hiện đại**: nested layouts, route groups, `loading.tsx`, `error.tsx`, `not-found.tsx`, `searchParams`, và tư duy “route segment là boundary của UX và data flow”. Trong docs hiện tại, layout là UI dùng chung và giữ state khi điều hướng; `loading.js` dùng Suspense để render loading từ server trong lúc segment stream về; `error.js` là error boundary theo segment; `not-found.js` là UI cho trạng thái 404 trong segment. Đây là các file mà team product dùng hàng ngày, không phải “kiến thức optional”. citeturn22view1turn22view4turn14view6turn14view5turn14view7

Thứ hai, roadmap hiện tại dạy `Server Component` và `Client Component` đúng ở mức cơ bản, nhưng chưa đủ sắc nét ở chỗ **`"use client"` là boundary, không phải nhãn dán gắn bừa**. Next.js docs nhấn mạnh rằng layouts và pages mặc định là Server Components; khi một file có `"use client"`, toàn bộ imports và child thuộc client bundle; và để giảm bundle JS, nên đặt `"use client"` ở component tương tác nhỏ nhất thay vì bọc cả trang. Đây là một khác biệt rất lớn giữa “code chạy được” và “code product tốt”. fileciteturn0file0L169-L211 citeturn14view0turn14view1turn14view2

Thứ ba, phần data flow hiện tại vẫn là `fake data -> page -> map -> card`, có tác dụng dạy UI render, nhưng chưa dạy **server-first data fetching, caching, streaming, API layer và mutation**. Docs của Next.js hiện khuyến khích fetch ngay ở component cần data, tận dụng memoization của `fetch`, cache khi phù hợp, và dùng Suspense/streaming để tránh block toàn page. Với client state kéo dài và cache server state, TanStack Query hiện cung cấp query key, cache share, invalidation sau mutation, và optimistic update với rollback. Nếu không học phần này, intern sẽ rất dễ thành “useEffect fetch và setState ở khắp nơi”. fileciteturn0file0L270-L338 citeturn14view3turn14view4turn19view1turn19view2turn19view3turn19view4

Thứ tư, roadmap chưa có **auth flow, session, authorization, Data Access Layer và DTO**. Trong Next.js guide, auth được tách làm ba khái niệm riêng: authentication, session management, authorization. Guide cũng khuyên dùng DAL để tập trung logic đọc/ghi data, authz và chỉ trả ra DTO an toàn tối thiểu. Đây là phần cực quan trọng nếu mục tiêu của bạn là “mindset công ty product” chứ không chỉ làm demo. citeturn15view1turn15view3turn15view2turn18view4turn18view0

Thứ năm, phần form hiện tại mới chỉ là controlled input với `useState`, chưa có **server-side validation, pending state, validation error, secure Server Action**. Next.js forms guide hiện hỗ trợ form với Server Actions, `useActionState`, `useFormStatus`, và khuyên validate server-side bằng Zod. Guide cũng nhấn mạnh phải verify auth và authz trong từng action, kể cả khi form chỉ render ở trang đã login. Đây là kiến thức production-ready rất thực dụng. fileciteturn0file0L387-L408 citeturn17view1turn17view2turn17view4turn17view3turn6view1

Thứ sáu, roadmap TypeScript dạy tốt các viên gạch đầu tiên, nhưng chưa có các phần **strict mode, strict null thinking, object immutability mindset, generic thực chiến, inferred types, typed routes, plugin của Next.js, và cách type hóa boundary giữa server/client/API/form/query**. Zod docs nói rõ `strict: true` là best practice cho mọi project TypeScript; TS handbook khuyên `unknown` an toàn hơn `any`; `strictNullChecks` giúp ngăn bug từ `null`/`undefined`; và Next.js hiện có built-in TS plugin cùng `typedRoutes` đã stable. Nếu mục tiêu là production-ready, phần TS phải được nâng từ “khai báo type” lên “kiểm soát boundary và bug class”. fileciteturn0file1L306-L350 citeturn23view2turn23view3turn23view4turn23view1turn23view0

Thứ bảy, roadmap hiện tại gần như chưa chạm tới **testing, deployment, environment variables, frontend security, performance, responsive design, accessibility, Git workflow**, trong khi production checklist chính thức của Next.js đặt đây là các trụ cột trước khi app lên production. Docs cũng khuyến nghị dùng TypeScript plugin, lint a11y, `<Image>`, Font Module, `<Script>`, `useReportWebVitals`, `next build`, testing bằng Vitest/Jest/Playwright/Cypress, deployment qua Node/Docker/static export tùy capability, và cảnh giác với `NEXT_PUBLIC_`, CSP, headers, CSRF, validation của user input. citeturn27view0turn27view1turn27view2turn27view4turn32view2turn34view0turn35view0turn35view1turn33view0turn33view2turn33view3turn33view4

Về **thứ tự học**, roadmap hiện tại có một thứ tự chấp nhận được cho phase intern: TypeScript nền, App Router cơ bản, component/props, fake data, `map/find`, form UI, rồi mini project. Nhưng nếu goal là đi từ intern đến junior production-ready, thứ tự hiện tại **chưa tối ưu** vì nó thiếu phần React mental model trước khi đào sâu Next-specific pattern. React docs nhấn mạnh state là snapshot, lifting state là kỹ thuật cốt lõi, duplicate state là nguồn bug phổ biến, และ nhiều trường hợp bạn “không cần Effect”. Nếu không học các mental model này ngay sau TS basics, người học dễ nhớ folder structure của Next nhưng lại dùng state/effect sai cách. fileciteturn0file0L107-L211 fileciteturn0file1L240-L258 citeturn29view3turn29view4turn29view0turn29view1turn30view0turn30view1turn29view2

Về **mức độ lan man**, roadmap hiện tại thật ra không lan man theo nghĩa “học quá nhiều thứ thừa”. Vấn đề của nó ngược lại: nó **quá gọn ở phần tutorial, nhưng quá thiếu ở phần engineering**. Những mục như `map`, `find`, `padding`, `hover`, `flex`, `grid` không sai, nhưng nếu đứng riêng thành “kiến thức chính” quá sớm, người học dễ tưởng frontend là ghép mảnh UI rời rạc, trong khi công việc thật là quản lý boundary, data flow, trạng thái, validation, lỗi, hiệu năng và collaboration. fileciteturn0file0L288-L383

Kết luận ngắn gọn: **roadmap hiện tại tốt cho Intern phase đầu, nhưng chưa phải roadmap production-ready**. Nó nên được giữ lại như phần “Foundation Bootcamp”, rồi được bọc thêm một lớp product-engineering hoàn chỉnh phía sau.

## Khung tư duy production-ready

Roadmap mới nên được thiết kế theo một nguyên tắc rất rõ: **không học theo API rời rạc, mà học theo vòng đời của feature thật**.

Feature thật trong công ty product thường đi theo flow này:

```txt
Requirement
→ route/page/layout
→ lấy data ở server hoặc API layer
→ render UI
→ tương tác client
→ validate input
→ mutate data
→ xử lý loading/error/empty
→ auth/authz
→ test
→ deploy
→ theo dõi performance
```

Flow này hợp với Next.js App Router vì App Router tổ chức app theo route segment, layout, loading, error, not-found, Server Components mặc định, và hỗ trợ BFF pattern qua Route Handlers/Server Actions. Nó cũng hợp với TypeScript strict mode vì mỗi boundary đều phải có type rõ ràng: props, DTO, form schema, API response, query key, session payload. citeturn22view4turn14view0turn14view6turn14view5turn14view7turn16view0turn23view1turn23view2

Có sáu nguyên tắc xương sống cho roadmap mới.

### Server-first trước, client-only sau

Trong App Router, pages và layouts mặc định là Server Components. Điều đó cho phép fetch data gần nguồn, dùng secret an toàn ở server, giảm JS gửi xuống browser, và stream UI dần ra client. Vì vậy, mindset hiện đại không phải “mọi thứ là client page”, mà là “mặc định server, chỉ client ở chỗ thật sự cần tương tác”. citeturn14view0turn14view1turn14view2

### State phải phân loại rõ

React team nhấn mạnh state là snapshot, duplicate state là nguồn bug, và nhiều trường hợp không cần `useEffect` để tính toán dữ liệu hiển thị. Còn TanStack Query quản lý query/mutation, cache, invalidation, optimistic updates cho async server state. Vì vậy, production mindset là:

- local UI state: `useState`
- complex local workflow: `useReducer`
- shared state giữa component gần nhau: lift state up
- server state/cache: TanStack Query hoặc fetch ở server
- global UI shell state: Context hoặc store nhẹ, chỉ khi thật cần. citeturn29view3turn29view4turn29view1turn30view0turn30view2turn19view1turn19view2turn19view3turn19view4

### Data access phải có lớp và có giới hạn

Next.js data security guide khuyên project mới nên có DAL riêng, chỉ chạy ở server, có authz, và chỉ trả DTO tối thiểu an toàn. Điều này giúp tránh kiểu code nguy hiểm như query DB ở nhiều nơi rồi pass raw object thẳng vào client component. Đây là một trong những mindset “đi làm product” quan trọng nhất. citeturn18view4turn18view0

### Form và mutation phải coi input là untrusted

Forms guide khuyên validate ở server bằng Zod, hiển thị validation errors bằng `useActionState`, và verify authentication/authorization trong từng Server Action. Data security guide cũng nói phải luôn validate client input, kể cả `searchParams`, headers, form data. Nói kiểu dễ hiểu: **mọi thứ đi từ browser lên đều phải nghi ngờ trước**. citeturn17view1turn17view2turn17view4turn17view3turn33view2

### Production không phải bước cuối, mà là cách học ngay từ đầu

Production checklist của Next.js đặt performance, security, metadata, type safety, accessibility, build verification, bundle analysis và Core Web Vitals vào checklist trước khi ship. Nghĩa là nếu bạn học “xong code rồi mới nghĩ tới production”, bạn sẽ phải đập đi làm lại. Tốt hơn là mang production mindset vào từng phase. citeturn27view0turn27view1turn27view2turn28view4

### TypeScript phải là công cụ suy nghĩ, không phải đồ trang trí

TS handbook được viết cho “everyday programmers”, nhưng vẫn nhấn mạnh rõ `unknown` an toàn hơn `any`, `strictNullChecks` giúp tránh bug, generics giúp mô tả logic tổng quát, và object types có thể đặt bằng interface hoặc type alias. Chỉ dừng ở “type props cho component” là chưa đủ; bạn cần dùng TypeScript để mô hình hóa data flow toàn app. citeturn24view3turn23view3turn23view4turn24view0turn24view1turn24view2

## Roadmap theo level

### Intern

**Mục tiêu của phase này** là hết sợ codebase, đọc hiểu file/folder, hiểu React và Next.js ở mức đủ để tạo một feature nhỏ hoàn chỉnh mà không copy mù. Ở level này, bạn chưa cần “tối ưu architecture lớn”, nhưng phải có nền đúng ngay từ đầu. fileciteturn0file0L557-L596 fileciteturn0file1L525-L534

**Kiến thức cần học** nên đi theo thứ tự này: TypeScript strict basics, React mental model, App Router fundamentals, component/props, local state, conditional rendering, fake data, route params, Tailwind core, loading/empty/error UI cơ bản, semantic HTML và responsive mobile-first. TS nên bật `strict: true`; React cần hiểu state snapshot, lift state, tránh duplicate state; Next cần hiểu page/layout/nested routes; HTML/CSS cần hiểu semantic elements, accessibility cơ bản và responsive bằng media queries/mobile-first. citeturn23view2turn29view3turn29view4turn29view1turn22view0turn22view1turn22view4turn25view1turn26view0turn26view1turn26view2

**Vì sao cần học như vậy?** Vì intern hay mắc lỗi “học Next trước, nhưng không hiểu React”; hoặc “type được interface, nhưng không hiểu data shape”; hoặc “làm UI đẹp, nhưng semantic HTML sai”. Nếu học đúng thứ tự, bạn sẽ không biến `useEffect` thành cái búa dùng cho mọi thứ và không lạm dụng `any`. citeturn30view0turn30view1turn29view2turn23view3

**Ví dụ thực tế** cho app học tiếng Anh ở phase này là: landing page, danh sách khóa học, trang course detail, lesson detail, login/register UI giả, và một nút “Start lesson” có local state đơn giản. Bạn vẫn có thể dùng fake data để hiểu UI flow, vì roadmap hiện tại đã đúng ở chỗ dùng fake data làm bàn đạp cho người mới. fileciteturn0file0L254-L338 fileciteturn0file0L571-L582

**Sai lầm thường gặp** ở level này là:
- biến cả page thành Client Component chỉ vì có 1 nút click
- lạm dụng `any`
- lưu state trùng nhau
- fetch data bằng `useEffect` cho những thứ chỉ cần render từ props/fake data
- dùng `<div>` giả làm button
- code desktop trước rồi vá mobile sau
- gom hết mọi thứ vào `components/` mà không biết domain nào là gì. citeturn14view1turn23view3turn29view1turn30view0turn25view1turn26view2

**Mindset cần có** là: _“Em chưa cần biết mọi thứ, nhưng file nào em cũng phải giải thích được nó làm gì, data đi từ đâu tới đâu, user click thì điều gì xảy ra, và trạng thái rỗng/lỗi sẽ ra sao.”_ Đây là phần mindset rất tốt trong tài liệu hiện tại và nên giữ nguyên. fileciteturn0file0L557-L567

**Best practice** cho phase intern:
- luôn bật TS strict
- ưu tiên server component mặc định
- đặt `"use client"` nhỏ nhất có thể
- semantic HTML trước, style sau
- state tối thiểu, không duplicate
- mỗi route phải nghĩ đủ loading / empty / not found, dù mới là UI giả. citeturn23view2turn14view0turn14view1turn25view1turn29view1turn14view6turn14view7

**Mini project phù hợp**:  
`English Learning Explorer` — gồm Home, Courses, Course Detail, Lesson Detail, Login/Register UI giả, responsive mobile-first, semantic button/form, và type hóa toàn bộ fake data.

**Thời lượng khuyến nghị**: 4 đến 6 tuần. Sau khoảng 10 đến 14 ngày đầu, nên build mini project song song với việc học thay vì học xong mới code.

### Fresher

**Mục tiêu của phase này** là chuyển từ “làm được UI” sang “làm được feature thật có data, validation và auth cơ bản”. Nghĩa là bắt đầu chạm server/client boundary, mutation, API layer, session, folder organization và reusable component patterns.

**Kiến thức cần học** ở phase này gồm: server-first data fetching, `loading.tsx`, `error.tsx`, `not-found.tsx`, forms với Server Actions, Zod validation, `useActionState`, Route Handlers như BFF/API layer, environment variables, auth flow cơ bản, session management, authorization, DAL + DTO, và React Query cho các màn hình có client-side caching hoặc interactive data sync. Next.js docs hiện mô tả rất rõ các phần này, và đây là điểm roadmap cũ đang thiếu nhất. citeturn14view3turn14view6turn14view5turn14view7turn17view1turn17view4turn17view3turn16view0turn15view1turn15view3turn15view2turn18view4turn19view1turn19view2turn19view3turn35view1

**Vì sao cần học nó?** Vì app thật không chỉ render data; nó còn phải nhận input, validate, trả lỗi, bảo vệ route, bảo vệ resource, và tách code đọc/ghi data ra khỏi UI. Nếu thiếu phase này, bạn sẽ mắc kẹt ở mức “portfolio UI đẹp nhưng không ship được feature thật”. citeturn15view1turn15view2turn17view2turn18view4

**Ví dụ thực tế** cho web học tiếng Anh:
- user đăng ký và đăng nhập
- chỉ user đã login mới bookmark lesson
- form profile có validation email/password
- trang “My Courses” lấy data từ server
- khi bookmark lesson, UI cập nhật ngay rồi sync lại với server. citeturn15view1turn17view4turn19view4

**Sai lầm thường gặp** ở phase này là:
- tin rằng check ở page/layout là đủ cho action
- pass raw DB object ra client
- dùng `NEXT_PUBLIC_` cho secret mà không để ý
- route handler trả error message quá chi tiết
- dùng React Query cho cả local form state
- nghĩ rằng đã có middleware/proxy thì action không cần verify nữa. citeturn17view2turn18view4turn35view0turn16view1turn15view4turn33view2

**Mindset cần có** là: _“Browser là nơi không đáng tin. UI đẹp chưa phải feature hoàn chỉnh. Mọi mutation đều phải nghĩ tới validate, auth, error, rollback.”_ citeturn17view2turn33view2turn19view4

**Best practice** cho phase fresher:
- data đọc/ghi đi qua DAL hoặc API layer rõ ràng
- server action mỏng, business logic nằm ở server-only module
- response trả ra là DTO an toàn tối thiểu
- mọi form đều có pending + error + success state
- route segment nào cũng có loading/error/not-found hợp lý
- env chia rõ private và public. citeturn18view0turn18view4turn17view3turn14view6turn14view5turn14view7turn35view0

**Mini project phù hợp**:  
`English Learning Auth MVP` — login/register thật, session cookie, protected routes, bookmark lesson, progress form, profile update form, validation bằng Zod, pending/error states, Route Handlers hoặc Server Actions rõ ràng.

**Thời lượng khuyến nghị**: 6 đến 8 tuần. Sau 2 tuần đầu của phase, nên bắt đầu build auth flow thật.

### Junior

**Mục tiêu của phase này** là trở thành người có thể nhận một feature production-level từ đầu tới cuối: UI, data flow, quality gates, performance cơ bản, test, deploy, review code của người khác.

**Kiến thức cần học** gồm: scalable folder architecture, query key design, invalidation strategy, optimistic update an toàn, reusable component patterns, clean code, testing theo tầng, performance optimization, bundle awareness, accessibility có hệ thống, deployment thực tế, observability cơ bản, Git workflow, code review hygiene, và typed routes/type-safe navigation. Next.js production checklist, testing guide, deploy guide, typed routes config, web.dev Core Web Vitals và MDN accessibility/responsive docs là các mảnh ghép rất quan trọng ở level này. citeturn19view3turn19view4turn27view0turn27view1turn27view2turn32view2turn34view0turn23view0turn28view4turn25view1turn26view0

**Vì sao cần học nó?** Vì từ junior trở đi, vấn đề không chỉ là “code đúng”, mà là “code có sống được trong codebase 6 tháng nữa không”. Query key kém sẽ làm invalidation bừa; folder kém làm feature khó tìm; a11y kém làm UI bị loại khỏi production checklist; performance kém sẽ phá UX. citeturn19view1turn19view3turn27view0turn28view4

**Ví dụ thực tế** cho web học tiếng Anh:
- dashboard cá nhân với nhiều widget
- lesson page có tabs, bookmark, notes, recent history
- search/filter/pagination
- admin tạo lesson/content
- E2E test cho signup flow, purchase flow, bookmark flow
- deployment staging và production. citeturn32view2turn34view0

**Sai lầm thường gặp**:
- generic component quá sớm, thành khó dùng hơn component thường
- query key lộn xộn dẫn đến cache sai
- tối ưu performance theo cảm giác, không theo metric
- lẫn lộn server state với UI state
- viết test snapshot nhiều nhưng không test user flow
- đẩy secret vào client bundle do dùng `NEXT_PUBLIC_` sai. citeturn19view1turn19view3turn28view4turn32view2turn35view0

**Mindset cần có** là: _“Feature ship được là feature có thể test, đo, rollback, review và maintain.”_

**Best practice** cho phase junior:
- adopt GitHub flow với branch ngắn, PR nhỏ, mỗi commit mang ý nghĩa rõ
- commit theo Conventional Commits
- `next build` phải xanh trước khi merge
- có unit test cho util/hook quan trọng và E2E cho critical flow
- theo dõi Web Vitals thay vì tranh cãi cảm tính về performance. citeturn10view0turn31view3turn31view0turn31view1turn32view2turn27view4turn28view4

**Mini project phù hợp**:  
`English Learning Production MVP` — có user dashboard, search/filter, progress tracking, bookmark/note, admin basic CRUD, E2E test cho flow quan trọng, deploy staging, performance pass cơ bản.

**Thời lượng khuyến nghị**: 8 đến 12 tuần.

### Middle

**Mục tiêu của phase này** là không chỉ làm feature, mà còn bắt đầu thiết kế cách **nhiều feature sống cùng nhau**: architecture, boundaries, conventions, performance budgets, observability, security review, quality culture.

**Kiến thức cần học** gồm: architecture decision making, DAL evolution, DTO discipline, OpenTelemetry/analytics cơ bản, bundle and request waterfall analysis, advanced caching strategy, rollout/revalidation strategy, CI/CD maturity, error budgets, review checklist, và cách hướng dẫn người khác. Next.js có guide riêng cho production, OpenTelemetry, data security, backend for frontend, testing và deployment; đây là level dùng docs như tài liệu design chứ không chỉ tài liệu syntax. citeturn13view1turn27view0turn18view4turn16view0turn32view2turn34view0

**Ví dụ thực tế** ở app học tiếng Anh:
- refactor app từ MVP sang domain-based structure
- tách “learning”, “auth”, “profile”, “admin”, “billing”
- chuẩn hóa query key factory
- chuẩn hóa design tokens và shared UI kit
- thêm tracing/logging cho action lỗi nhiều
- thiết kế checklist security/performance trước release. citeturn13view1turn27view0turn33view0turn33view2

**Sai lầm thường gặp** là over-engineer: microfrontend quá sớm, abstraction quá đẹp nhưng team không dùng nổi, hoặc “framework-first” thay vì “problem-first”.

**Mindset cần có** là: _“Architecture tốt không phải architecture phức tạp; nó là architecture giảm sai lầm lặp lại cho cả team.”_

**Mini project phù hợp**:  
`English Learning Platform Refactor` — nâng app junior lên structure domain-based, có tests thực dụng, CI, deploy strategy, web vitals tracking, security checklist, và coding standards nội bộ.

**Thời lượng khuyến nghị**: 8 đến 10 tuần, nhưng phase này nên đi song song với làm dự án thật nhiều hơn học tài liệu thuần.

## Project structure và data flow

Cấu trúc hiện tại trong roadmap:

```txt
src/
├── app/
├── components/
├── data/
├── types/
├── lib/
└── styles/
```

là **ổn cho phase intern**, vì nó rất dễ nhìn và ít cognitive load. Với người mới, đó là điều tốt. Nhưng nếu đi lên production-ready thì structure này sẽ nhanh chóng bị quá tải vì `components/` thành “sọt rác”, `lib/` thành “thư mục bí ẩn”, còn `data/` không phân biệt fake data, DAL, API client hay schema. fileciteturn0file0L436-L446

Thiết kế lại hợp lý hơn cho mục tiêu công ty product là:

```txt
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (learning)/
│   │   ├── courses/page.tsx
│   │   ├── courses/[courseId]/page.tsx
│   │   ├── lessons/[lessonId]/page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── api/
│   │   └── progress/route.ts
│   ├── global-error.tsx
│   ├── layout.tsx
│   └── not-found.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── server/
│   │   ├── queries/
│   │   └── types.ts
│   ├── courses/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── server/
│   │   ├── queries/
│   │   └── types.ts
│   ├── lessons/
│   │   ├── components/
│   │   ├── server/
│   │   ├── queries/
│   │   └── types.ts
│   └── progress/
│       ├── components/
│       ├── server/
│       ├── queries/
│       └── types.ts
├── server/
│   ├── auth/
│   ├── dal/
│   ├── db/
│   └── actions/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── api-client/
│   │   ├── query/
│   │   ├── env/
│   │   ├── utils/
│   │   └── constants/
│   ├── types/
│   └── styles/
├── providers/
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── tests/
    ├── unit/
    └── e2e/
```

Cấu trúc này bám đúng tinh thần App Router là route nằm trong `app/`, còn logic theo domain nằm ở `features/`, logic server-only nằm ở `server/`, shared UI và utility nằm ở `shared/`, còn providers tách riêng để boundary client rõ ràng hơn. Nó cũng phù hợp với khuyến nghị của Next.js về route segments, server-only modules, DAL, DTO, Route Handlers và testing. citeturn22view4turn18view4turn18view0turn16view0turn32view2

### Vai trò từng nhóm folder

`app/` là nơi định nghĩa route, layout, loading, error, not-found, metadata và public endpoint theo convention của Next.js. Đây là “bản đồ URL và entry UI” của ứng dụng. citeturn22view0turn22view1turn14view6turn14view5turn14view7turn16view0

`features/` là nơi gom mọi thứ theo domain business. Ví dụ `features/courses` sẽ chứa card, list, schema, query key, adapters, types riêng của domain course. Cách này giúp code “đọc theo business” nhanh hơn nhiều so với `components/` phẳng.

`server/` là nơi đặt logic chỉ chạy ở server: auth, database access, DAL, server actions dùng lại. Từ security guide của Next.js, đây chính là nơi nên gắn `server-only` và đặt auth/authz/business logic. citeturn18view0turn18view4

`shared/` là nơi chứa những món dùng chung thật sự giữa nhiều domain: nút, modal, input, helper, formatter, query provider helpers, constants. Nếu một component chỉ dùng cho course, đừng nhét vào shared.

`providers/` là nơi đặt các provider client-side thật sự global như TanStack Query provider, theme provider. Nhờ vậy bạn không vô tình làm root tree thành client bundle lớn hơn cần thiết. citeturn14view1

`tests/` tách unit và e2e rõ ràng, bám theo testing guide của Next.js: unit/component/integration/E2E là các tầng test khác nhau, và với async server components, E2E thường đáng tin hơn unit test thuần. citeturn32view2turn32view3

### Data flow toàn project

Với app product thật, nên chia data flow thành bốn luồng lớn.

**Luồng render đọc dữ liệu**

```txt
request
→ route page trong app/
→ gọi DAL server-only
→ DAL auth check + lấy data + map sang DTO
→ page render server component
→ truyền DTO tối thiểu xuống client component nếu cần
```

Đây là kiểu flow tốt cho App Router vì Server Components mặc định có thể fetch gần nguồn, dùng secret an toàn, và không cần serialize mọi thứ giữa “hàm fetch” và page như thời cũ. citeturn14view0turn23view1turn18view4

**Luồng mutation bằng form**

```txt
user submit form
→ Server Action
→ validate bằng Zod
→ auth/authz lại trong action hoặc DAL
→ ghi data
→ revalidate/query invalidate
→ trả state lỗi hoặc thành công cho UI
```

Đây là flow rất hợp với form profile, edit progress, create note, update settings. Nó gọn, an toàn và đúng tinh thần tài liệu forms/auth/data security. citeturn17view1turn17view4turn15view1turn33view2

**Luồng client data sync**

```txt
client component
→ useQuery(queryKey, queryFn)
→ cache
→ user mutate
→ useMutation
→ optimistic update nếu phù hợp
→ invalidateQueries
→ sync lại server
```

Luồng này phù hợp cho bookmark, recent lessons, search results có tương tác, infinite list, dashboards. Nó không nên dùng cho local form input hay toggle UI thuần local. citeturn19view1turn19view2turn19view3turn19view4

**Luồng auth**

```txt
login form
→ server action / auth library
→ tạo session
→ cookie
→ route/page/action kiểm session
→ secure authorization check ở DAL hoặc DB
→ chỉ trả DTO phù hợp quyền
```

Next.js auth guide nhấn mạnh rõ phải tách authentication, session management và authorization; đồng thời dùng optimistic route checks chỉ cho redirect/UI nhanh, còn secure checks phải dùng dữ liệu thực từ server/database khi đụng dữ liệu nhạy cảm. citeturn15view1turn15view3turn15view2turn15view4

### Ví dụ code từ cơ bản đến nâng cao

**Cơ bản: page lấy data server-side**

```tsx
// app/(learning)/courses/page.tsx
import { getCourseCardList } from '@/server/dal/courses';

export default async function CoursesPage() {
  const courses = await getCourseCardList();

  return (
    <main>
      <h1>Courses</h1>
      {courses.map((course) => (
        <div key={course.id}>{course.title}</div>
      ))}
    </main>
  );
}
```

Dùng khi: page chủ yếu là đọc dữ liệu và render UI.  
Không nên dùng khi: bạn cần subscribe client cache phức tạp hoặc tương tác real-time dày.

**Trung bình: form validation bằng Server Action + Zod**

```tsx
// server/actions/update-profile.ts
'use server';

import { z } from 'zod';
import { updateProfile } from '@/server/dal/profile';

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
});

export async function updateProfileAction(_: unknown, formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  await updateProfile(parsed.data);
  return { ok: true, errors: {} };
}
```

Dùng khi: form ghi data lên server, cần validation và error state rõ ràng.  
Không nên dùng khi: đó chỉ là local search input hoặc local UI filter chưa cần mutation.

**Nâng cao: TanStack Query cho optimistic bookmark**

```tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function BookmarkButton({ lessonId }: { lessonId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ lessonId }),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      const previous = queryClient.getQueryData<string[]>(['bookmarks']) ?? [];
      queryClient.setQueryData<string[]>(['bookmarks'], (old = []) => [...old, lessonId]);
      return { previous };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(['bookmarks'], context?.previous ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return <button onClick={() => mutation.mutate()}>Bookmark</button>;
}
```

Dùng khi: user cần cảm giác phản hồi tức thời, failure có rollback rõ.  
Không nên dùng khi: mutation hiếm, không cần cache, hoặc local state là đủ.

## Learning path, mini project và checklist

### Flow học thực chiến

Đây là learning path tôi khuyến nghị để vừa đi từ intern lên, vừa tránh học lan man.

| Giai đoạn | Trọng tâm | Kết quả đầu ra |
|---|---|---|
| Tuần đầu | TS strict basics + React state mental model | Đọc hiểu props, state, data shape, không lạm dụng `any` |
| Giai đoạn nền | App Router, page/layout, route segments, component organization | Tạo được app nhiều page và giải thích được data flow |
| Giai đoạn feature | forms, validation, loading/error/not-found, server data | Làm được feature hoàn chỉnh chứ không chỉ UI |
| Giai đoạn product | auth, session, authz, DAL, API layer, React Query | Làm được feature gần production |
| Giai đoạn ship | testing, performance, accessibility, security, deployment | Có thể ship và tự kiểm chất lượng |
| Giai đoạn scale | architecture, conventions, observability, code review | Sống được trong codebase team |

Thực tế nhất là **không đợi học xong mới build**. Sau mỗi lớp kiến thức, phải có mini project hoặc feature spike nhỏ. Đây cũng phù hợp với cách React/Next docs tổ chức kiến thức: học concepts rồi gắn lại vào use case thật, thay vì học syntax vô hạn. citeturn24view3turn3search7

### Mini project cho từng phase

**Intern**  
`English Learning Explorer`  
Phạm vi: Home, Courses, Course Detail, Lesson Detail, fake data, responsive, semantic HTML, loading/empty/not-found UI cơ bản.  
Mục tiêu: hiểu routing, props, state, project structure, data flow đơn giản.

**Fresher**  
`English Learning Auth MVP`  
Phạm vi: login/register thật, profile form, protected route, session cookie, validation Zod, bookmark/progress mutation.  
Mục tiêu: hiểu auth, forms, server actions, DAL, API layer.

**Junior**  
`English Learning Production MVP`  
Phạm vi: dashboard, bookmark, notes, search/filter/pagination, admin lesson CRUD cơ bản, React Query, error boundaries, E2E tests, staging deploy.  
Mục tiêu: làm feature từ đầu tới cuối với quality gates.

**Middle**  
`English Learning Platform Refactor`  
Phạm vi: refactor structure theo domain, query key strategy, performance audits, security headers/CSP, web vitals, CI/CD.  
Mục tiêu: tư duy scale và maintainability.

### Checklist đánh giá năng lực

**Intern checklist**

- Hiểu `strict`, `unknown`, optional, union, typing props, typing `useState`. citeturn23view2turn23view3turn23view4
- Giải thích được page, layout, nested route, dynamic segment. citeturn22view0turn22view1turn22view4
- Phân biệt được Server Component và Client Component, biết đặt `"use client"` đúng chỗ. citeturn14view0turn14view1
- Không dùng `any` như thói quen.
- Không lạm dụng `useEffect` để transform data. citeturn30view0turn29view2
- Dùng semantic HTML và làm giao diện mobile-first cơ bản. citeturn25view1turn26view2

**Junior checklist**

- Thiết kế được DAL + DTO cho một domain. citeturn18view4
- Làm được form có server-side validation, pending, error, success. citeturn17view4turn17view3
- Hiểu auth/session/authorization khác nhau và đặt check đúng tầng. citeturn15view1turn15view3turn15view2
- Dùng React Query đúng cho server state, biết invalidation và optimistic update. citeturn19view1turn19view3turn19view4
- Có test cho critical flows. citeturn32view2turn32view3
- Tự deploy app bằng Node hoặc Docker, hiểu static export bị giới hạn gì. citeturn34view0turn34view4
- Biết kiểm tra performance/a11y/security trước merge. citeturn27view2turn33view0turn28view4

**Middle checklist**

- Viết được conventions cho team, không chỉ cho riêng mình.
- Review được architecture theo domain boundaries.
- Thiết kế được release checklist: build, types, tests, perf, sec, observability. citeturn27view0turn13view1
- Giải thích được vì sao chọn server-first, vì sao query key thiết kế như vậy, vì sao DTO chỉ trả field tối thiểu. citeturn14view0turn19view1turn18view4
- Mentor được intern/fresher bằng flow, không dạy vẹt API.

## Coding standards, lỗi thường gặp và giới hạn phân tích

### Coding standards đề xuất

#### Naming

| Hạng mục | Rule |
|---|---|
| Component | `PascalCase`, tên theo domain hoặc role: `CourseCard`, `LessonPlayer` |
| Hook | `useSomething`, ví dụ `useLessonProgress` |
| Server action | động từ rõ nghĩa: `createNoteAction`, `updateProfileAction` |
| DAL function | động từ business: `getCourseById`, `enrollUserInCourse` |
| Query key | có prefix domain: `['courses']`, `['courses', courseId]` |
| File route | theo convention của Next, không “sáng tạo” thêm: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts` citeturn22view0turn14view6turn14view5turn16view0 |

#### TypeScript rules

| Rule | Dùng khi nào | Không nên làm |
|---|---|---|
| Bật `strict: true` | Mọi project | Tắt strict để “cho nhanh” citeturn23view2 |
| Ưu tiên `unknown` hơn `any` | Input chưa rõ shape | `any` tràn lan trong props/API/parser citeturn23view3 |
| Bắt buộc nghĩ tới `null`/`undefined` | data async, optional props | ép `!` vô tội vạ citeturn23view4 |
| Type ở boundary | props, DTO, schema, session, API response | annotate mọi biến nhỏ một cách dư thừa |
| Generics dùng khi có quy luật lặp | util, data helpers, reusable hooks | generic hóa mọi component chỉ để “trông xịn” citeturn24view0turn24view1 |
| Bật `typedRoutes` | app có nhiều route/link | hardcode string route khắp nơi nếu app lớn citeturn23view0 |

#### Component rules

| Rule | Khi nào dùng | Khi nào không nên |
|---|---|---|
| Server Component mặc định | page/layout/read-only render | component có browser API hoặc interaction citeturn14view0 |
| `"use client"` nhỏ nhất có thể | button, form client, modal, interactive list | wrap cả page nếu chỉ có 1 input tìm kiếm citeturn14view1 |
| Presentational vs feature component | shared UI cần tái sử dụng | tách quá mức khi app còn nhỏ |
| Semantic HTML trước styling | form, button, nav, heading | dựng `<div>` giả button/link citeturn25view1 |
| Loading/Error/Empty rõ ràng | mọi route/feature có data async | chỉ render “không có gì” khi lỗi xảy ra citeturn14view6turn14view5turn14view7 |

#### State management rules

| Trường hợp | Công cụ nên dùng | Không nên dùng |
|---|---|---|
| Input, modal, tab, toggle | `useState` | React Query/store global citeturn30view3 |
| Nhiều state local liên quan chặt | `useReducer` | nhiều `useState` rời rạc khó sync citeturn30view2turn29view1 |
| Hai component cần chung state | Lifting state up | duplicate state ở cả hai chỗ citeturn29view4 |
| Data từ server cần cache | TanStack Query hoặc fetch ở server | tự viết `useEffect + loading + error + retry` trùng lặp citeturn19view1turn19view2turn14view3 |
| Tính toán từ props/state | tính ngay trong render | `useEffect` rồi `setState` lại citeturn30view0turn29view2 |

#### Git workflow rules

GitHub flow là workflow branch-based nhẹ, phù hợp cho cộng tác; mỗi branch nên ngắn và mô tả rõ, commit nên là thay đổi tách biệt, PR cần summary/problem rõ, checks phải pass trước merge, và branch nên xóa sau khi merge. Conventional Commits là convention nhẹ giúp commit message có nghĩa cho cả người lẫn tooling; `feat` cho feature mới, `fix` cho bug fix, và có thể dùng scope như `feat(auth): ...`. Đây là bộ đôi workflow rất hợp cho team product vừa và nhỏ. citeturn10view0turn31view3turn31view0turn31view1

Khuyến nghị thực chiến:

```txt
main        -> production-ready
develop     -> tùy team, không bắt buộc
feature/*   -> feature branch
fix/*       -> bug fix branch
chore/*     -> maintenance
```

Và commit theo kiểu:

```txt
feat(courses): add course detail page
fix(auth): prevent redirect loop after logout
refactor(progress): move mutation logic into DAL
test(bookmarks): add e2e for bookmark flow
```

### Security, performance, responsive, accessibility

**Security cơ bản bắt buộc học**

- Secret chỉ ở server; `NEXT_PUBLIC_` sẽ bị inline vào bundle client lúc build. citeturn35view0turn35view1
- Mọi client input đều phải validate. citeturn33view2turn17view4
- Mọi Server Action đều phải verify auth/authz lại. citeturn17view2turn33view2
- Cân nhắc CSP để chống XSS/clickjacking/code injection. citeturn33view0turn33view1
- Có thể cấu hình `allowedOrigins` cho server actions để giảm rủi ro CSRF. citeturn33view3
- Dùng headers phù hợp như `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options` khi cần. citeturn33view4

**Performance optimization cơ bản**

- Giảm client bundle bằng server-first và `"use client"` tối thiểu. citeturn14view2turn27view0
- Tận dụng caching, parallel fetch, loading UI, streaming. citeturn14view3turn14view4turn27view1
- Dùng `<Image>`, Font Module, Script Component khi phù hợp. citeturn27view2
- Theo dõi Core Web Vitals: LCP, INP, CLS. LCP tốt nên ở mức 2.5 giây hoặc thấp hơn; Google cũng nhấn mạnh Core Web Vitals đo loading, interactivity và visual stability. citeturn28view0turn28view1turn28view2turn28view3turn28view4

**Responsive design**

Responsive web design là cách làm giao diện render tốt trên nhiều screen sizes; media queries là phần quan trọng để tạo layout theo viewport; mobile-first là cách tiếp cận phổ biến và thực dụng. Với app học tiếng Anh, bạn nên thiết kế mobile-first ngay từ đầu vì lesson page và vocabulary page thường được dùng trên điện thoại nhiều. citeturn26view0turn26view1turn26view2turn26view4

**Accessibility**

MDN nhấn mạnh semantic HTML là “right element for the right job”; button thật có keyboard accessibility sẵn; semantic HTML còn giúp mobile và SEO tốt hơn. Với intern, nguyên tắc nhớ nhanh là: **đừng tạo button bằng div nếu không có lý do cực mạnh**. Forms cần label tử tế; lỗi cần thông báo rõ; focus và keyboard phải usable. citeturn25view0turn25view1

### Những lỗi intern frontend thường gặp

- Thấy chạy được là nghĩ đã đúng.
- Hễ có data async là quăng vào `useEffect`.
- Thấy TypeScript báo lỗi thì dùng `any` hoặc `!` để dập.
- Tách component quá sớm hoặc ngược lại nhét mọi thứ vào một file.
- Không phân biệt UI state và server state.
- Chỉ làm happy path, không nghĩ loading/error/empty/not-found.
- Dùng non-semantic HTML vì “style nhanh hơn”.
- Không biết file nào là client boundary, file nào là server-only.
- Đọc code theo từng dòng, không đọc theo flow user action.

Những lỗi này đều nối trực tiếp với các tài liệu chính thức: React cảnh báo về effect không cần thiết và duplicate state; Next.js nhấn mạnh server/client boundary, route-level loading/error/not-found, security/input validation; MDN nhấn mạnh semantic HTML. citeturn30view0turn29view1turn14view1turn14view6turn14view5turn14view7turn33view2turn25view1

### Những kỹ năng giúp đọc code team nhanh hơn

- Đọc từ route vào, không đọc từ utils ra.
- Tự hỏi: user vào route nào, page nào render, data lấy từ đâu, action ghi ở đâu, lỗi hiển thị chỗ nào.
- Tách ba luồng: render data, mutate data, auth guard.
- Tìm boundary trước: file nào có `"use client"`, file nào `server-only`, file nào `route.ts`, file nào `page.tsx`.
- Tìm query key, schema, DTO trước khi đụng debugger.
- Đọc PR title/commit messages nếu team dùng GitHub flow + Conventional Commits.

### Roadmap cuối cùng dạng training nội bộ

Nếu gom lại thành một “tài liệu training nội bộ công ty”, roadmap cuối nên đi theo nhịp sau:

```txt
Foundation
→ React mental model
→ App Router fundamentals
→ Server vs Client boundary
→ Data fetching and route UX states
→ Forms and mutations
→ Auth, session, authorization
→ API layer and DAL
→ React Query and state strategy
→ Project architecture
→ Testing
→ Performance + Accessibility + Responsive
→ Security
→ Deployment + Git workflow
→ Refactor and scaling mindset
```

Đây là phiên bản roadmap tôi khuyến nghị bạn dùng làm tài liệu master. Nó vẫn giữ tinh thần “intern dễ hiểu”, nhưng thêm đủ chiều sâu để đi tiếp tới fresher, junior và middle mà không phải viết lại từ đầu. Toàn bộ khung này bám vào tài liệu chính thức hiện hành của Next.js, React, TypeScript, TanStack Query, MDN và web.dev. citeturn3search7turn14view0turn16view0turn15view1turn17view1turn18view4turn19view1turn27view0turn32view2turn25view1turn26view0turn28view4

### Giới hạn phân tích

Phần “project structure hiện tại có ổn không” của tôi đang dựa trên **hai file roadmap markdown**, không phải toàn bộ source code repo thật. Nghĩa là tôi có thể đánh giá rất chắc về **roadmap học**, nhưng chưa thể audit các vấn đề cụ thể như import cycles, shared component duplication, naming inconsistency, hoặc anti-pattern đang có trong repo hiện tại vì tôi chưa được xem codebase thật. Ngoài ra, docs của Next.js đang thay đổi khá nhanh theo major versions; ví dụ current docs đã thể hiện App Router typing và config options theo chuẩn mới như `typedRoutes` stable và các ví dụ `params/searchParams` trong server pages. Vì vậy, khi bạn chính thức áp dụng roadmap này, nên chốt version chuẩn cho team rồi khóa convention lại trong tài liệu nội bộ. citeturn23view0turn23view1turn22view4