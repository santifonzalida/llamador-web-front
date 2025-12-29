import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog'

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './confirmacion-dialog.component.html',
})
export class DialogContentComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogContentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { name: string }
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }