import { Directive, ElementRef, Input, HostBinding, Optional, Self, OnDestroy, ViewContainerRef, DoCheck, AfterViewInit, Renderer2 } from '@angular/core';
import { MatFormFieldControl, MatFormField } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';

@Directive({
  selector: '[matContentEditableInput]',
  providers: [{ provide: MatFormFieldControl, useExisting: MatContentEditableInput }],
  exportAs: 'matContentEditableInput'
})
export class MatContentEditableInput implements MatFormFieldControl<any>, OnDestroy, DoCheck, AfterViewInit {

  controlType?: string = 'mat-content-editable-input';

  focused: boolean = false;

  static nextId = 0;
  @HostBinding() id = `mat-content-editable-input-${MatContentEditableInput.nextId++}`;

  stateChanges = new Subject<void>();

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh: string) {
    this._placeholder = plh;
    this._placeholderElm.innerText = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;
  private _placeholderElm: HTMLElement;

  get empty() {
    let n = this._elm.nativeElement.innerHTML;
    return !n;
  }

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
    return this.ngControl && this.ngControl.touched && this.ngControl.invalid;
  }
  private _errorState = false;

  private _fmSubscription: Subscription;

  constructor(
    private _elm: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl,
    private _fm: FocusMonitor,
    private _matFormField: MatFormField,
    private _render2: Renderer2
  ) {

    this._fmSubscription = this._fm.monitor(this._elm.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    this._placeholderElm = this._render2.createElement('span');
    this._render2.addClass(this._placeholderElm, 'content-editable-placeholder');
    this._render2.setStyle(this._placeholderElm, 'position', 'absolute');
    this._placeholderElm.style.opacity = `50%`;
    this._placeholderElm.onclick = (event: MouseEvent) => this.onPlaceholderClick(event);
  }

  ngOnInit() {
  }

  ngDoCheck() {

  }

  ngAfterViewInit() {
    this.setupPlaceholderVisibiliy();
    this.ngControl.control.valueChanges.subscribe(val => {
      this.setupPlaceholderVisibiliy();
    });
  }

  setupPlaceholderVisibiliy() {
    if (this.empty) {
      setTimeout(() => {
        this._showPlaceholder();
      }, 10);
    } else {
      this._hidePlaceholder();
    }
  }

  onPlaceholderClick(event: MouseEvent) {
    const target = event.target as Element;
    this.setFocusToContentEditableElement(target.parentElement);
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  private _showPlaceholder() {
    const matFormElmRef = this._matFormField.getConnectedOverlayOrigin().nativeElement as HTMLElement;
    const matFormElmBoundingClient = matFormElmRef.getBoundingClientRect();
    const contentEditableElmBoundingClient = this._elm.nativeElement.getBoundingClientRect();

    this._render2.setStyle(this._placeholderElm, 'fontSize', window.getComputedStyle(this._elm.nativeElement).fontSize);
    this._render2.setStyle(this._placeholderElm, 'lineHeight', window.getComputedStyle(this._elm.nativeElement).lineHeight);
    this._render2.setStyle(this._placeholderElm, 'color', window.getComputedStyle(this._elm.nativeElement).color);
    const left = contentEditableElmBoundingClient.left - matFormElmBoundingClient.left;
    const top = contentEditableElmBoundingClient.top - matFormElmBoundingClient.top;
    this._render2.setStyle(this._placeholderElm, 'left', left + 'px');
    this._render2.setStyle(this._placeholderElm, 'top', top + 'px');
    this._render2.appendChild(matFormElmRef, this._placeholderElm);
    this.stateChanges.next();
  }

  private _hidePlaceholder() {
    this._placeholderElm.remove();
  }

  onContainerClick(event: MouseEvent) {
    this.setFocusToContentEditableElement(event.target as Element);
  }

  setFocusToContentEditableElement(elm: Element) {
    if (this.disabled)
      return;

    if (elm.hasAttribute('contenteditable')) {
      this._elm.nativeElement.focus();
    } else if (elm.querySelector('[contenteditable="true"]') && elm.querySelector('[contenteditable="true"]').hasAttribute('contenteditable')) {
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
