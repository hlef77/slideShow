import {
  Component,
  Inject
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';

@Component({
  selector: 'app-choice-dialog',
  templateUrl: './choiceDialog.html',
  styleUrls: ['./choiceDialog.css'],
})
export class ChoiceDialogComponent {

  title: string;
  message: string;
  items: Array<string>;
  choiceItem: string;

  constructor(
    public dialogRef: MatDialogRef < ChoiceDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = this.data.title;
    this.message = this.data.message;
    this.items = this.data.items;
  }

  onOK = (): void => {
    this.dialogRef.close(this.choiceItem);
  }

}
