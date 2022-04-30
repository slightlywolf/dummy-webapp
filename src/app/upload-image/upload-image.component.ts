import { Component, OnInit } from '@angular/core';
import { ImageSnippet } from './ImageSnippet';
import { ImageServiceService } from '../image-service.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit 
{
  constructor(private imageService: ImageServiceService) { }
  
  selectedFile!: ImageSnippet;


  ngOnInit(): void {
  
  }

  processImage(imageInput: any)
  {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => 
    {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
            this.onSuccess();

        },
        (err) => {
            this.onError();

        })
    });

    reader.readAsDataURL(file);
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }
}
