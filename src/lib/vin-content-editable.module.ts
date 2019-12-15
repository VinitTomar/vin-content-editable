import { NgModule } from '@angular/core';
import { VinContentEditable } from './directives/vin-content-editable.directive';
import { MatContentEditableInput } from './directives/mat-content-editable-input.directive';



@NgModule({
  declarations: [VinContentEditable, MatContentEditableInput],
  imports: [
  ],
  exports: [VinContentEditable, MatContentEditableInput]
})
export class VinContentEditableModule { }
