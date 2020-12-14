export interface Device {
  connections?: string[] | { [key: string]: string };
  identifiers?: string | string[];
  manufacturer?: string;
  model?: string;
  name?: string;
  sw_version?: string;
  via_device?: string;
}
