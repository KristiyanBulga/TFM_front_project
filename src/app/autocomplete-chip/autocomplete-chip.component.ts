import { Component, OnInit,  ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-chip',
  templateUrl: './autocomplete-chip.component.html',
  styleUrls: ['./autocomplete-chip.component.css']
})
export class AutocompleteChipComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  elementCtrl = new FormControl('');
  filtered_elements: Observable<string[]>;
  list_elements: string[] = [];
  @Input() all_elements!: string[];
  @Output() selected_elements: EventEmitter<string[]> = new EventEmitter();

  @ViewChild('fruitInput') elementInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filtered_elements = this.elementCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.all_elements.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.list_elements.push(value);
      this.selected_elements.emit(this.list_elements.slice())
    }
    event.chipInput!.clear();
    this.elementCtrl.setValue(null);
  }

  remove(elem: string): void {
    const index = this.list_elements.indexOf(elem);
    if (index >= 0) {
      this.list_elements.splice(index, 1);
    }
    this.selected_elements.emit(this.list_elements.slice())
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.list_elements.push(event.option.viewValue);
    this.selected_elements.emit(this.list_elements.slice())
    this.elementInput.nativeElement.value = '';
    this.elementCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.all_elements.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

}
