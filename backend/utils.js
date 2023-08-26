function generateInviteCode(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
}

const numberOfCodesToGenerate = 3;
const inviteCodes = [];

for (let i = 0; i < numberOfCodesToGenerate; i++) {
  const inviteCode = generateInviteCode(8);
  inviteCodes.push(inviteCode);
}

console.log("Generated Invite Codes:", inviteCodes);
