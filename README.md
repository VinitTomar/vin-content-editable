# vinContentEditable

By default angular forms only support HTML input element. If someone in their project has to use an element with `contenteditable=true`, in that case they do not any choice except write code for checking validation and other form state like touched or pristien etc, by themselves, which is very error prone.

To overcome this issue, I have created this package `vinContentEditable`. This package has two directives.

1. vinContentEditable: used for adding support for `contenteditable=true` with angular forms.
2. matContentEditableInput: used for adding support for [angular material form field](https://material.angular.io/components/form-field/overview).

## Installation

npm install --save vin-content-editable.

## Usage

1. Import `VinContentEditableModule` in the component module where we want to use generict toggle.
```
  import { VinContentEditableModule } from 'vin-content-editable';

  @NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    VinContentEditableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
```

2. Use `vinContentEditable` directive for angular forms and `matContentEditableInput` for material form field on the target HTML element.

```
<div vinContentEditable [formControl]="fc"></div>
```

### For angular material form field

```
<mat-form-field>
  <div vinContentEditable [formControl]="fc" matContentEditableInput placeholder="content editable"></div>
  <mat-error *ngIf="fc.touched && fc.invalid">{{matceErr()}}</mat-error>
  <mat-hint>content editable field</mat-hint>
</mat-form-field>
```

3. Here is the type script file code 

```
  fc = new FormControl('form control', Validators.required);

  constructor() { }

  ngOnInit() {
    this.fc.valueChanges.subscribe(val => {
      console.log({ val })
    });
  }
```

4. This is `optional`. In case of angular material there are very good changes that you design might break. To overcome this issue add below style to `global style sheet` or in the current componet with `::ng-deep`. 

```
.mat-form-field-infix {
    [contenteditable]:first-child {
      margin: 0px;
      outline: 0px;
      min-height: 1.125em;
      line-height: 1.125em;
      display: inline-block;
    }
  }
```

or if you are using scss, you can import style from `@import 'vin-content-editable/mat-content-editable-styles';` and run mixin `mat-content-editable-styles` after your angular material styles.

Thats all you have to do.

If you find any issue please feel free to raise it on github.

### Tip
You can use `innerText` or `innerHTML` to get value from with `vinContentEditable` directive. E.g. 
```
vinContentEditable="innerHTML"
```

## Example
Here is the [Demo](https://stackblitz.com/edit/ng-content-editable)



### Please have a look on these also
1. [NgGenericRadio](https://www.npmjs.com/package/ng-generic-radio)
2. [NgGenericToggle](https://www.npmjs.com/package/ng-generic-toggle)