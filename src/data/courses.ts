/**
 * The reservation form, in six courses.
 *
 * Ported verbatim from the previous static site — field keys, option strings,
 * validation messages and conditional logic are unchanged, so the payload that
 * reaches the Apps Script endpoint (and the column order in Code.gs) still
 * matches exactly. Change a `key` here and you must change COLUMNS in Code.gs.
 */

export type FieldType = 'text' | 'tel' | 'email' | 'textarea' | 'single' | 'multi';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  autocomplete?: string;
  options?: string[];
  /** adds a "Something else" chip with a free-text box */
  other?: boolean;
  /** only show this field when another answer is not the given value */
  showIf?: { key: string; not: string };
  error: string;
}

export interface Course {
  name: string;
  note: string;
  fields: Field[];
}

export const COURSES: Course[] = [
  {
    name: 'Introductions',
    note: "So we know who we're seating.",
    fields: [
      { key: 'fullName', label: 'Full name', type: 'text', autocomplete: 'name', error: 'Add your full name.' },
      { key: 'whatsapp', label: 'WhatsApp number', type: 'tel', autocomplete: 'tel', help: "This is where we'll confirm your seat.", error: 'Add a number we can reach you on.' },
      { key: 'email', label: 'Email address', type: 'email', autocomplete: 'email', error: 'Check this email address.' },
      { key: 'ageGroup', label: 'Age group', type: 'single', options: ['18–24', '25–34', '35–44', '45+'], error: 'Pick one.' },
    ],
  },
  {
    name: 'About you',
    note: 'A few lines is plenty.',
    fields: [
      { key: 'work', label: 'Tell us what you do', type: 'text', placeholder: 'Architect, med student, running a bakery…', error: 'Tell us what you do.' },
      { key: 'about', label: 'Tell us a little about yourself', type: 'textarea', help: "What you're into, what you're currently obsessed with, anything.", error: 'Give us a couple of lines.' },
    ],
  },
  {
    name: "Why you're here",
    note: 'Be honest — every answer is a good one.',
    fields: [
      {
        key: 'why', label: 'What made you sign up for Happy Plate?', type: 'multi', other: true,
        options: ["I'm here for the food", 'Looking to meet new people', 'Chasing new experiences', 'Hoping to find my kind of people', 'Found us on Instagram', 'Stepping out of my comfort zone', "Just curious to see what it's all about"],
        error: 'Pick at least one.',
      },
      { key: 'firstTime', label: 'Is this your first supper club?', type: 'single', options: ['Yes, my first one', "No, I've been to one before"], error: 'Pick one.' },
    ],
  },
  {
    name: 'At the table',
    note: 'This one shapes the menu, so it matters.',
    fields: [
      {
        key: 'food', label: "What's your food preference?", type: 'multi', other: true,
        options: ['Vegetarian', 'Vegan', 'Eggetarian', 'Non-vegetarian', 'Jain', 'Gluten-free', 'Dairy-free'],
        error: 'Pick at least one.',
      },
      { key: 'allergies', label: 'Any food allergies or dietary restrictions?', type: 'text', help: '“None” is a perfectly good answer.', placeholder: 'None', error: "Write “None” if you don't have any." },
    ],
  },
  {
    name: 'Your company',
    note: '',
    fields: [
      { key: 'party', label: "Who's joining us?", type: 'single', options: ['Just me', "I'm bringing a friend", "We're coming as a group"], error: 'Pick one.' },
      { key: 'guests', label: 'Their name(s)', type: 'text', help: 'So we can set the right number of places.', showIf: { key: 'party', not: 'Just me' }, error: 'Add their name(s).' },
    ],
  },
  {
    name: 'Conversation',
    note: 'We seat the table around these.',
    fields: [
      {
        key: 'topics', label: 'What kind of conversations do you enjoy?', type: 'multi', other: true,
        options: ['Travel', 'Food', 'Books', 'Movies & shows', 'Music', 'Startups & business', 'Art & creativity', 'Personal growth', 'Life stories', 'Anything with good company'],
        error: 'Pick at least one.',
      },
      { key: 'waitlist', label: 'If this dinner is fully booked, would you like to join the waitlist?', type: 'single', options: ['Yes, keep me posted', 'No, maybe next time'], error: 'Pick one.' },
    ],
  },
];

/** Marker used internally for the "Something else" chip. */
export const OTHER = '__other__';
