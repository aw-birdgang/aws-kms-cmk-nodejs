import {kmsSimpleTest} from "./kms/kms_simple";

import dotenv from "dotenv";

dotenv.config();

async function sample() {
    const result = await kmsSimpleTest();
    console.log('plaintext :: ' + result.plaintext);
    console.log('cleartext :: ' + result.cleartext);
}
sample();
