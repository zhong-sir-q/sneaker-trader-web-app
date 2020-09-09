import React, { useState } from 'react';
import { Input, ListGroup, ListGroupItem } from 'reactstrap';
import OutsideClickHandler from './OutsideClickHandler';

type AutoSuggestInputProps = {
  label: string;
  options: string[];
};

const AutoSuggestInput = (props: AutoSuggestInputProps) => {
  const { options } = props;

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const filter = (val: string) => options.filter((opt) => opt.toLowerCase().indexOf(val.toLowerCase()) > -1);

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;

    setUserInput(value);

    if (value === '') {
      setShowSuggestions(false);
      setFilteredSuggestions(options);
    } else {
      setShowSuggestions(true);
      setFilteredSuggestions(filter(value));
    }
  };

  // 38 is up arrow and 40 is down arrow
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      setActiveSuggestionIdx(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestionIdx]);
    } else if (e.keyCode === 38) {
      if (activeSuggestionIdx === 0) return;
      setActiveSuggestionIdx(activeSuggestionIdx - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestionIdx - 1 === filteredSuggestions.length) return;
      setActiveSuggestionIdx(activeSuggestionIdx + 1);
    }
  };

  const onClickSuggestion = (e: React.MouseEvent<any, MouseEvent>) => {
    setActiveSuggestionIdx(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.currentTarget.innerText);
  };

  const SuggestionsList = () => {
    if (showSuggestions && userInput) {
      const listItems =
        filteredSuggestions.length === 0 ? (
          <ListGroupItem>No suggestions</ListGroupItem>
        ) : (
          filteredSuggestions.map((opt, idx) => (
            <ListGroupItem
              active={activeSuggestionIdx === idx}
              onClick={onClickSuggestion}
              tag='button'
              action
              key={idx}
            >
              {opt}
            </ListGroupItem>
          ))
        );

      return (
        <OutsideClickHandler handler={() => setShowSuggestions(false)}>
          <ListGroup style={{ position: 'absolute', marginTop: '2px', zIndex: 1 }}>{listItems}</ListGroup>
        </OutsideClickHandler>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      <label>{props.label}</label>
      <Input
        type='text'
        onFocus={() => setShowSuggestions(true)}
        value={userInput}
        placeholder={props.label}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <SuggestionsList />
    </React.Fragment>
  );
};

export default AutoSuggestInput;
