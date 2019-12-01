import { Directive, forwardRef, ElementRef, Input, OnInit, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[vinContentEditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VinContentEditable),
      multi: true
    }
  ],
  host: {
    '[attr.tabindex]': 'disabled ? null : -1',
    '[id]': 'uniqueId',
    '[style.opacity]': 'disabled ? 0.7 : null'
  }
})
export class VinContentEditable implements ControlValueAccessor, OnInit {

  static nextUniqueId: number = 0;

  private isDisabled = false;

  valFrom: string = 'innerText';

  @Input('disabled')
  get disabled() {
    return this.isDisabled;
  }
  set disabled(value: boolean) {
    this.isDisabled = value != null && `${value}` !== 'false'
  }


  onChange = (_: any) => { }
  onTouched = () => { }

  @Input('id')
  uniqueId = `ng-content-editable-${++VinContentEditable.nextUniqueId}`;

  constructor(private _elm: ElementRef<HTMLElement>) {
  }

  ngOnInit() {
    if (!this.disabled) {
      this._elm.nativeElement.setAttribute('contenteditable', 'true');
    }
  }

  @HostListener('input', ['$event.target'])
  onInput(elm: HTMLElement) {
    this.onChange(elm[this.valFrom]);
  }

  @HostListener('focusout', ['$event.target'])
  onFocusOut(elm: HTMLElement) {
    this.onTouched();
  }

  writeValue(value: string): void {
    this._elm.nativeElement.innerText = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (this.disabled) {
      this._elm.nativeElement.removeAttribute('contenteditable');
    } else {
      this._elm.nativeElement.setAttribute('contenteditable', 'true');
    }
  }


}