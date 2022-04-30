import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json','Access-Control-Allow-Origin':'*'})

  }

  public uploadImage(image: File): Observable<any>
  {
    const URL = "https://5hiau7tulh.execute-api.ap-southeast-2.amazonaws.com/v1";
    const BUCKETNAME = "dummy-webapp-bucket";
    const imagename = "image.png";

    const header = new HttpHeaders();
    header.set('content-type','image/png');
    header.set('Access-Control-Allow-Origin','*');

    const formData = new FormData();
    formData.append('image', image);

    return this.http.put(URL + "/"+ BUCKETNAME + "/" + imagename,image,{headers:header});
  }
}
