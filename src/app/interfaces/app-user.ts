import { Availability } from './availability';
import { Location } from './location';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  location: Location;
  availability: Availability | undefined;
}
