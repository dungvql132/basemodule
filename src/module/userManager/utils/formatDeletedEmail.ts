export function convertEmailToDeletedEmail(
  email: string,
  id: number | string
): string {
  return `__${id}__${email}`;
}

export function convertDeletedEmailToEmail(
  deletedEmail: string,
  id: number | string
): string {
  const regexPattern = /^__(.+)__(.*)$/;

  // Sử dụng match() để kiểm tra và trích xuất id và địa chỉ email từ chuỗi
  const matchResult = deletedEmail.match(regexPattern);

  if (matchResult && matchResult.length === 3) {
    const idMatch = matchResult[1];
    if (idMatch === String(id)) return matchResult[2];
    throw new Error("Id is not match");
  } else {
    throw new Error("cannot convert DeletedEmail To Email");
  }
}
