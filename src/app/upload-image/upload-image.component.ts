import { Component, OnInit } from '@angular/core';
import { ImageServiceService } from '../image-service.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit 
{
  constructor(private imageService: ImageServiceService) { }
  

  ngOnInit(): void {}

  processImage(imageInput: any)
  {
    /* grab file */
    const file: File = imageInput.files[0];
    this.imageService.uploadImage(file).then(
        /* do something with success */
      ).catch(
        /* catch error here */
      );
  }

}
