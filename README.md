
AWS CLI 환경 구성
````
$ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
$ sudo installer -pkg AWSCLIV2.pkg -target /
$ aws configure
> input resource

````

원본 암호화 및 삭제
````
// KMS 마스터 키를 이용해 keys 를 생성 합니다. 
aws kms generate-data-key --key-id (alias or keyId) --key-spec AES_256 --region origin > cli/out/keys.txt

//
echo "Plaintext-value" | base64 --decode > cli/out/datakey

// 생성된 keys 에 CiphertextBlob를 decode 합니다. (후에 decode 된 CiphertextBlob 을 이용해서 Plaintext 를 복호화 합니다.)
echo "CiphertextBlob-value" | base64 --decode > cli/out/encrypted-datakey

// decode 된 Plaintext 의 datakey로 원본 데이타를 암호화 합니다.
openssl enc -in ./cli/original.txt -out ./cli/out/original-encrypted.txt -e -aes256 -k fileb://./cli/out/datakey

// 키 복구 확인을 위해, 원본 데이타 (orifinal.txt) 와 원본 데이타의 암호화에 사용했던 dataKey는 삭제 합니다.

````

원본 복구
````

// Plaintext 의 복구를 위해서 encrypted-datakey 를  decrypt 합니다. 
aws kms decrypt --ciphertext-blob fileb://./cli/out/encrypted-datakey --region origin

// Plaintext  통해서 datakey 를 다시 복구 할 수 있습니다.
echo "Plaintext-value" | base64 --decode > cli/out/datakey

// 복구된 datakey 를 이용해서 삭제된 original 파일을 복구 할 수 있습니다. 
openssl enc -in ./cli/out/original-encrypted.txt -out ./cli/out/original-recovered.txt -d -aes256 -k fileb://./cli/out/datakey

````

실행
````
$ npx ts-node src/main.ts
````
