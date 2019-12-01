# vinContentEditable

By default angular forms only support HTML input element. If someone in their project has to use an element with `contenteditable=true`, in that case they do not any choice and have to manually check for validation and other form state like touched or pristien etc. They have to use a lot of boiler plate code. 

To overcome this issue have created this package `vinContentEditable`. Use this directive if there is a need of using `contenteditable=true`. 

## Installation

npm install --save vin-content-editable.

## Usage

1. Import `VinContentEditableModule` in the component module where we want to use generict toggle.
```
  import { VinContentEditableModule } from 'ng-content-editable';

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

2. Use `vinContentEditable` directive on the target HTML element.

```
<p vinContentEditable [formControl]="fc"></p>
{{fc.value}}
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

Thats all you have to do.

If you find any issue please feel free to raise it on github.

## Example
Here is the [Demo](https://stackblitz.com/edit/ng-content-editable)



### Please have a look on these also
1. [NgGenericRadio](https://www.npmjs.com/package/ng-generic-radio)
2. [NgGenericToggle](https://www.npmjs.com/package/ng-generic-toggle)