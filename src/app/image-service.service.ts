import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { waitForAsync } from '@angular/core/testing';



@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private http: HttpClient) { }


  public async uploadImage(image: File): Promise<any>
  {
    // url for the lambda function that will be posted to
    const URL = "https://vsm7nvbky6.execute-api.ap-southeast-2.amazonaws.com/dev/upload-on-s3-function";

    /* Headers for the http post */
    const header = new HttpHeaders();
    header.set('content-type','application/json');

    /********BODY of http request */
    var newImage = new LambdaImage();
    newImage.filename = image.name;



    try
    {
      newImage.img64 = await this.fileToBase64(image) as string;
      // wait for the filetobase64 to be done since its async

      // create regex to replace garbage that filereader prefixes its reads with
      const regex = /data:image\/.*;base64,/;
      newImage.img64 = newImage.img64.replace(regex,"")

      /* log the payload and image to the console */
      console.log("Payload : \nFilename: " + newImage.filename + "\nimg64: " + newImage.img64);

    } catch(e:any)
    {
      console.warn(e.message());
    }

    /* create json to post to lambda function */
    const jsonConverted = JSON.stringify(newImage);

    /* post http request, toPromise since the function runs async */
    return this.http.post(URL,jsonConverted, {headers:header}).toPromise();
  }

  private async fileToBase64(file: File): Promise<any>
  {
    const fr = new FileReader();

    /* Wraps the file reader in a promise since filereader is async but doesnt return a promise */
    var promise = new Promise((resolve, reject) => 
    {
      // On error
      fr.onerror = () => 
      {
        fr.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      
      //on work
      fr.onload = () => 
      {
        resolve(fr.result); // return the promise with file read as base64
      };
      /* read the file as base64 */
      fr.readAsDataURL(file);
    });
    return promise;
  }
}



//https://www.freakyjolly.com/angular-input-file-image-file-upload-to-base64-tutorial-by-example/

/******
  Class which holds filename and the base64 image makes json stringify easy
*/
class LambdaImage
{
  filename!: string;
  img64!: string;
}



