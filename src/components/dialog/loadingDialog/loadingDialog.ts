import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loadingDialog.html',
  styleUrls: ['./loadingDialog.css'],
})
export class LoadingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef < LoadingDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  close = (result): void => {
    this.dialogRef.close(result);
  }

}
