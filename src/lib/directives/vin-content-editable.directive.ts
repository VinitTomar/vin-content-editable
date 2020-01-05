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
  },
  exportAs: 'vinContentEditable'
})
export class VinContentEditable implements ControlValueAccessor, OnInit {

  static nextUniqueId: number = 0;

  private isDisabled = false;

  @Input('vinContentEditable')
  set valueFrom(val: 'innerText' | 'innerHTML') {
    if (val && val !== 'innerText' && val !== 'innerHTML') {
      throw ('Only "innerText or innerHTML can be assigned to vinContentEditable.');
    } else {
      this._valFrom = val || 'innerText';
    }
  }
  private _valFrom: string = 'innerText';

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
    if (elm.textContent) {
      this.onChange(elm[this._valFrom]);
    } else {
      elm.innerHTML = '';
      this.onChange('');
    }
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
      this._elm.nativeElement.setAttribute('contenteditable', 'false');
    } else {
      this._elm.nativeElement.setAttribute('contenteditable', 'true');
    }
  }


}
