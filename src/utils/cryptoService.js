import crypto from 'crypto';
import cryptoJs from 'crypto-js';

export class CryptoService {

    static secretKey = process.env.SECRET_HASH_KEY; // Chave secreta (guarde de forma segura)

    // Função para gerar o hash SHA-256 do CPF
    static generateHash(cpf) {
        return cryptoJs.SHA256(cpf).toString(cryptoJs.enc.Base64); // Usando Base64 para armazenar o hash
    }

    // Função para criptografar o CPF com AES-256
    static encryptCpf(cpf) {
        const iv = crypto.randomBytes(16);  // Gerando IV aleatório
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);

        let encryptedCpf = cipher.update(cpf, 'utf8', 'hex');
        encryptedCpf += cipher.final('hex');

        return { iv: iv.toString('hex'), encryptedCpf };
    }

    // Função para descriptografar o CPF
    static decryptCpf(encryptedCpf, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));

        let decryptedCpf = decipher.update(encryptedCpf, 'hex', 'utf8');
        decryptedCpf += decipher.final('utf8');

        return decryptedCpf;
    }

    // Função para criptografar o Email com AES-256
    static encryptEmail(email) {
        const iv = crypto.randomBytes(16);  // Gerando IV aleatório
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);

        let encryptedEmail = cipher.update(email, 'utf8', 'hex');
        encryptedEmail += cipher.final('hex');

        return { iv: iv.toString('hex'), encryptedEmail };
    }

    // Função para descriptografar o Email
    static decryptEmail(encryptedEmail, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));

        let decryptedEmail = decipher.update(encryptedEmail, 'hex', 'utf8');
        decryptedEmail += decipher.final('utf8');

        return decryptedEmail;
    }
}
