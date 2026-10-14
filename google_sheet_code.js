/**
 * =========================================================================
 * MÃ GOOGLE APPS SCRIPT ĐỒNG BỘ & TỰ ĐỘNG GỘP DÒNG CHO THIỆP CƯỚI
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT:
 * 1. Mở Google Sheet danh sách khách mời của bạn.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa toàn bộ mã cũ trong trình chỉnh sửa, dán toàn bộ đoạn mã bên dưới vào.
 * 4. Bấm vào nút "Lưu" (biểu tượng đĩa mềm 💾).
 * 5. Bấm vào nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Quản lý bản triển khai" (Manage deployments).
 * 6. Bấm vào biểu tượng cây bút chì (Chỉnh sửa) ở bản triển khai hiện tại:
 *    - Chọn "Phiên bản mới" (New version).
 *    - Bấm "Triển khai" (Deploy).
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khóa tối đa 10 giây để tránh lỗi khi nhiều khách cùng gửi cùng lúc
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var contents = (e && e.postData) ? e.postData.contents : "";
    var data = {};

    try {
      if (contents) {
        data = JSON.parse(contents);
      } else if (e && e.parameter) {
        data = e.parameter;
      }
    } catch (err) {
      data = (e && e.parameter) ? e.parameter : {};
    }

    // 1. Trích xuất các trường dữ liệu
    var name = (data["Họ và tên"] || data.name || data.hoVaTen || data.fullName || "").toString().trim();
    if (!name) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Thiếu Họ và tên"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Thời gian hiện tại theo múi giờ Việt Nam GMT+7
    var timeStr = Utilities.formatDate(new Date(), "GMT+7", "M/d/yyyy H:mm:ss");
    if (data["Thời gian"]) timeStr = data["Thời gian"];

    var attendance = (data["Trạng thái tham dự"] || data.attendance || data.trangThaiThamDu || "").toString().trim();
    var guestOf = (data["Phân loại khách"] || data.guestOf || data.guest_of || data.phanLoaiKhach || data.phanLoai || data.guest || "").toString().trim();
    var guestCount = (data["Số lượng"] || data.guestCount || data.guest_count || data.soLuong || data.count || "").toString().trim();
    var eventTarget = (data["Sự kiện tham gia"] || data.eventTarget || data.event_target || data.suKienThamGia || data.suKien || data.event || "").toString().trim();
    var wish = (data["lời chúc phúc"] || data["Lời chúc phúc"] || data.message || data.wish || data.loiChuc || data.loiChucPhuc || data.content || "").toString().trim();

    // 2. Tự động đọc dòng tiêu đề (Dòng 1) để map đúng vị trí các cột A -> G
    var lastRow = sheet.getLastRow();
    var lastCol = Math.max(sheet.getLastColumn(), 7);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Mặc định cột theo bảng của bạn:
    // A (1): Thời gian
    // B (2): Họ và tên
    // C (3): Trạng thái tham dự
    // D (4): Phân loại khách
    // E (5): Số lượng
    // F (6): Sự kiện tham gia
    // G (7): lời chúc phúc
    var colTime = 1, colName = 2, colAttendance = 3, colGuestOf = 4, colCount = 5, colEvent = 6, colWish = 7;

    for (var i = 0; i < headers.length; i++) {
      var h = headers[i].toString().toLowerCase().trim();
      if (h.indexOf("thời gian") !== -1 || h.indexOf("time") !== -1) colTime = i + 1;
      else if (h.indexOf("họ và tên") !== -1 || h.indexOf("tên") !== -1 || h.indexOf("name") !== -1) colName = i + 1;
      else if (h.indexOf("trạng thái") !== -1 || h.indexOf("tham dự") !== -1) colAttendance = i + 1;
      else if (h.indexOf("phân loại") !== -1 || h.indexOf("khách của") !== -1) colGuestOf = i + 1;
      else if (h.indexOf("số lượng") !== -1 || h.indexOf("người") !== -1) colCount = i + 1;
      else if (h.indexOf("sự kiện") !== -1) colEvent = i + 1;
      else if (h.indexOf("chúc") !== -1 || h.indexOf("lời chúc") !== -1) colWish = i + 1;
    }

    // 3. TÌM KIẾM DÒNG ĐÃ TỒN TẠI THEO "HỌ VÀ TÊN" (GỘP 2 FORM THÀNH 1 DÒNG)
    var existingRow = -1;
    if (lastRow > 1) {
      var nameValues = sheet.getRange(2, colName, lastRow - 1, 1).getValues();
      var normalizedTargetName = name.toLowerCase().replace(/\s+/g, " ");

      // Dò từ dòng mới nhất lên để ưu tiên dòng gần nhất của người này
      for (var r = nameValues.length - 1; r >= 0; r--) {
        var existingName = (nameValues[r][0] || "").toString().trim().toLowerCase().replace(/\s+/g, " ");
        if (existingName === normalizedTargetName) {
          existingRow = r + 2; // +2 vì mảng tính từ 0 nhưng dòng bắt đầu từ dòng 2
          break;
        }
      }
    }

    // 4. NẾU ĐÃ CÓ DÒNG CỦA KHÁCH NÀY -> CẬP NHẬT / GỘP VÀO DÒNG ĐÓ
    if (existingRow > 0) {
      // Cập nhật lại thời gian mới nhất
      sheet.getRange(existingRow, colTime).setValue(timeStr);

      // Cập nhật trạng thái tham dự nếu lượt này có gửi
      if (attendance) {
        sheet.getRange(existingRow, colAttendance).setValue(attendance);
      }

      // Cập nhật phân loại khách nếu lượt này có gửi
      if (guestOf) {
        sheet.getRange(existingRow, colGuestOf).setValue(guestOf);
      }

      // Cập nhật số lượng người nếu lượt này có gửi
      if (guestCount) {
        sheet.getRange(existingRow, colCount).setValue(guestCount);
      }

      // Cập nhật sự kiện tham gia nếu lượt này có gửi
      if (eventTarget) {
        sheet.getRange(existingRow, colEvent).setValue(eventTarget);
      }

      // Cập nhật lời chúc phúc nếu lượt này có gửi
      if (wish) {
        sheet.getRange(existingRow, colWish).setValue(wish);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        action: "merged_updated",
        row: existingRow,
        name: name
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. NẾU CHƯA CÓ DÒNG NÀO CỦA KHÁCH NÀY -> TẠO DÒNG MỚI
    var newRow = [];
    newRow[colTime - 1] = timeStr;
    newRow[colName - 1] = name;
    newRow[colAttendance - 1] = attendance || "Có, tôi sẽ tham dự";
    newRow[colGuestOf - 1] = guestOf || "Khách mời của cả hai";
    newRow[colCount - 1] = guestCount || "1";
    newRow[colEvent - 1] = eventTarget || "Tất cả Sự kiện nhà Trai";
    newRow[colWish - 1] = wish || "";

    // Đảm bảo không có phần tử undefined
    for (var k = 0; k < Math.max(headers.length, 7); k++) {
      if (newRow[k] === undefined) newRow[k] = "";
    }

    sheet.appendRow(newRow);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      action: "inserted_new",
      name: name
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Google Apps Script Wedding RSVP & Wishes Sync is running perfectly!"
  })).setMimeType(ContentService.MimeType.JSON);
}
