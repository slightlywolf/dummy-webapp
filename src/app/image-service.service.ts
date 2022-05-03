import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';

class LambdaImage
{
  filename!: string;
  img64!: string;
}
@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json','Access-Control-Allow-Origin':'*'})

  }

  public async uploadImage(image: File, filename: string): Promise<any>
  {
    // sends the image as a json file with the name as 'filename' and the image as 'img64' encoded in base64
    const URL = "https://vsm7nvbky6.execute-api.ap-southeast-2.amazonaws.com/dev/upload-on-s3-function";
    //const BUCKETNAME = "s3-dummy-webapbucket";
    //const imagename = "image.png";

    const header = new HttpHeaders();
    header.set('content-type','application/json');

    var newImage = new LambdaImage();
    newImage.filename = filename;

    // wrap the file reader in a promise 
    const fileToBase64 = () => 
    {
      const temporaryFileReader = new FileReader();
    
      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => 
        {
          temporaryFileReader.abort();
          reject(new DOMException("Problem parsing input file."));
        };
    
        temporaryFileReader.onload = () => 
        {
          resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(image);
      });
    };

    try
    {
      newImage.img64 = await fileToBase64() as string;
      newImage.img64 = newImage.img64.replace("data:image/png;base64,","")
      console.log("Payload : \nFilename: " + newImage.filename + "\nimg64: " + newImage.img64);

    } catch(e:any)
    {
      console.warn(e.message());
    }


    const jsonConverted = JSON.stringify(newImage);
    return this.http.post(URL,jsonConverted,{headers:header}).toPromise();

  }



 
//https://www.freakyjolly.com/angular-input-file-image-file-upload-to-base64-tutorial-by-example/




}
