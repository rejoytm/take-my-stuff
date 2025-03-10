import { Component, Input, OnInit } from '@angular/core';
import { Availability } from '@interfaces/availability';
import { days, hours, formatAvailabilityForDay } from '@utils/availability';
import { IonicModule } from '@ionic/angular';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-availability-picker',
  templateUrl: './availability-picker.component.html',
  styleUrls: ['./availability-picker.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, IonicModule],
})
export class AvailabilityPickerComponent implements OnInit {
  days = days;

  hours = hours;

  @Input() availability: Availability = {};
  @Input() class: string = '';

  onSelectChange(day: any, selectedValues: string[]) {
    if (!selectedValues.length) {
      delete this.availability[day];
    } else {
      this.availability[day] = selectedValues;
    }
  }

  getSelectedTextForDay(day: string): string | undefined {
    return formatAvailabilityForDay(this.availability, day);
  }

  ngOnInit() {}
}
