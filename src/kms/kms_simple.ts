import {
    KmsKeyringNode,
    buildClient,
    CommitmentPolicy,
} from '@aws-crypto/client-node'

const { encrypt, decrypt } = buildClient(
    CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
)

export async function kmsSimpleTest() {
    const generatorKeyId = process.env.GENERATOR_KEY_ID
    const keyId = process.env.KEY_ID;
    const origin = process.env.ORIGIN;
    const keyIds = [
        keyId,
    ]

    // @ts-ignore
    const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })
    let context = {
        stage: 'aws kms',
        purpose: 'aws kms app',
        origin: origin,
    }

    const cleartext = '이글은 곧 성지가 될 지어다.!!!'
    console.log("====== Original Text ======");
    console.log(cleartext);

    const { result } = await encrypt(keyring, cleartext, {
        // @ts-ignore
        encryptionContext: context,
    })

    const { plaintext, messageHeader } = await decrypt(keyring, result)
    const { encryptionContext } = messageHeader
    Object.entries(context).forEach(([key, value]) => {
        if (encryptionContext[key] !== value)
            throw new Error('Encryption Context does not match expected values')
    })
    return { plaintext, result, cleartext, messageHeader }
}
