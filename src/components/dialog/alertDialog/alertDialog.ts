import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alertDialog.html',
  styleUrls: ['./alertDialog.css'],
})
export class AlertDialogComponent {

  alertKind: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef < AlertDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.alertKind = this.data.alertKind;
    this.message = this.data.message;
  }

  onOK = (): void => {
    this.dialogRef.close(true);
  }

}
