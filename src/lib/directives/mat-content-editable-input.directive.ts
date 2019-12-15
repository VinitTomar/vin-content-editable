import { Directive, ElementRef, Input, HostBinding, Optional, Self, OnDestroy } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';

@Directive({
  selector: '[matContentEditableInput]',
  providers: [{ provide: MatFormFieldControl, useExisting: MatContentEditableInput }],
  exportAs: 'matContentEditableInput'
})
export class MatContentEditableInput implements MatFormFieldControl<any>, OnDestroy {

  controlType?: string = 'mat-content-editable-input';

  focused: boolean = false;

  static nextId = 0;
  @HostBinding() id = `mat-content-editable-input-${MatContentEditableInput.nextId++}`;

  stateChanges = new Subject<void>();

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    let n = this._elm.nativeElement.innerHTML;
    return !n;
  }
  private _placeholder: string;

  @Input()
  get value() {
    return this._elm.nativeElement.innerHTML;
  }
  set value(text: string) {
    this._elm.nativeElement.innerHTML = text;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = this.coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = this.coerceBooleanProperty(value);

    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;



  get errorState() {
    return this.ngControl.touched && this.ngControl.invalid;
  }
  private _errorState = false;

  private _fmSubscription: Subscription;

  constructor(
    private _elm: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private _fm: FocusMonitor
  ) {

    this._fm.monitor(this._elm.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

  }

  ngOnInit() {
    // console.log({ ngControl: this.ngControl })
    // this.ngControl.valueChanges.subscribe((val) => {
    //   setTimeout(() => {
    //     this._errorState = this.ngControl.invalid;
    //   }, 0);
    // });
  }


  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }


  onContainerClick(event: MouseEvent) {
    if (this.disabled)
      return;

    if ((event.target as Element).hasAttribute('contenteditable')) {
      this._elm.nativeElement.focus();
    } else if ((event.target as Element).querySelector('[contenteditable="true"]').hasAttribute('contenteditable')) {
      this._elm.nativeElement.focus();
    }
  }

  coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }

  ngOnDestroy() {
    this._fm.stopMonitoring(this._elm.nativeElement);
    this._fmSubscription.unsubscribe();
  }

}
