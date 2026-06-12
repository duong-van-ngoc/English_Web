import { Controller, Get } from '@nestjs/common';

/**
 * HealthController
 *
 * Nhiệm vụ:
 * - Nhận request kiểm tra trạng thái backend.
 * - Trả response đơn giản để biết server còn chạy.
 */
@Controller('health')
export class HealthController {
  /**
   * GET /api/health
   *
   * Mục đích:
   * - Kiểm tra backend đang hoạt động.
   *
   * Data flow:
   * Client request
   * → HealthController.check()
   * → trả response JSON
   */
  @Get()
  check() {
    return {
      success: true,
      message: 'Backend is healthy',
      data: {
        status: 'ok',
        service: 'English Learning Explorer Backend',
      },
    };
  }
}
