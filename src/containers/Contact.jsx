import React, { PureComponent } from 'react';
import {
  Avatar,
  Autocomplete,
//  Button,
  Chip,
  Divider,
  Card, 
  CardText, 
  CardTitle,
  TextField
} from 'react-md';

//import PhoneEmulator from './PhoneEmulator';
import guid from 'uuid/v1';

//import { randomImage } from 'utils/random';
//import PhoneEmulator from 'components/PhoneEmulator';

//import './_blocked-styles.scss';

//const sendMail = <Button icon>send</Button>;
const contacts = [
  'Albert Brady',
  'Barbara Butler',
  'Benny Warren',
  'Brad Briggs',
  'Brent Allen',
  'Carrie Tyler',
  'Christian Adams',
  'Darrel Mckenzie',
  'Edward Castro',
  'Elsa Mack',
  'Gregg Pearson',
  'Janet Goodwin',
  'Jeanne Hayes',
  'Juan Mccarthy',
  'Julia Robertson',
  'Lola Stephens',
  'Lori Jones',
  'Mable Santiago',
  'Marcia Mills',
  'Margaret Stevenson',
  'Maxine Wilkerson',
  'Randal Newton',
  'Roxanne Ryan',
  'Sergio Hansen',
  'Willie Dawson',
].map(contact => ({
  leftAvatar: <Avatar src="https://s3.ap-northeast-2.amazonaws.com/indoorposition-upload/ap-northeast-2%3A26592b8d-ad53-43c0-9d3c-8dbaa6c225b9-1520999959509-j8LZfHUN.jpg" alt={`${contact}'s avatar`} />,
  primaryText: contact,
}));
/*
const defaultBody = `Hi,
I just wanted to check in and see if you had any plans this upcoming weekend. ` +
  'We are thinking of heading up to Napa. Let us know if you\'d like to go and ' +
  'we\'ll make reservations.';
*/
export default class Contact extends PureComponent {
  state = {
    selected: [{
      key: 'initial-1',
      label: 'Freddy Kruger',
      avatar: <Avatar src="https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1" alt="Freddy Kruger's avatar" />,
    }, {
      key: 'initial-2',
      label: 'Bob Belcher',
      avatar: <Avatar src="https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1" alt="Bob Belcher's avatar" />,
    }],
  };

  selectContact = (name, i, matches) => {
    console.log(name+" "+i+" "+matches);
    const contact = matches[i];
    const selected = this.state.selected.slice();
    selected.push({ label: name, avatar: contact.leftAvatar, key: guid() });
    this.setState({ selected });
  };

  removeContact = (i) => {
    const selected = this.state.selected.slice();
    selected.splice(i, 1);
    this.setState({ selected });
  };

  render() {
    const { selected } = this.state;
    let selectedContacts = null;
    if (selected.length) {
      selectedContacts = (
        <div className="text-fields__contacts">
          {selected.map((contact, i) => (
            <Chip
              {...contact}
              className="text-fields__contact-chip"
              removable
              onClick={() => this.removeContact(i)}
            />
          ))}
        </div>
      );
    }

    return (
      <Card className="md-cell md-cell--12 md-text-container">
      <CardTitle title="Contact" />
      <CardText>
        {selectedContacts}
        <Autocomplete
          id="email-to"
          type="email"
          data={contacts}
          placeholder="To"
          block
          paddedBlock
          onAutocomplete={this.selectContact}
          clearOnAutocomplete
          autocompleteWithLabel
        />
        <Divider />
        <TextField
          id="email-subject"
          placeholder="Subject"
          block
          paddedBlock
          maxLength={80}
        />
        <Divider />
        <TextField
          id="email-body"
          placeholder="Body"
          block
          rows={4}
          paddedBlock
          maxLength={1000}
          errorText="Max 1000 characters."
        />
      </CardText>
    </Card>
      
    );
  }
}
