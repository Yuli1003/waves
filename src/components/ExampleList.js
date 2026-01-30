// @flow
import React from 'react';
import styled from 'styled-components';

type ExampleItem = {
  label: string,
  id: string,
};

type Props = {
  items: Array<ExampleItem>,
  isInverted?: boolean,
  selectedId?: string | null,
  onItemClick?: (id: string) => void,
};

const ExampleList = ({ items, isInverted = false, selectedId, onItemClick }: Props) => {
  return (
    <ListContainer>
      {items.map((item) => (
        <ListItem
          key={item.id}
          isInverted={isInverted}
          isSelected={item.id === selectedId}
          onClick={() => onItemClick && onItemClick(item.id)}
          hasClickHandler={!!onItemClick}
        >
          <ItemLabel isInverted={isInverted} isSelected={item.id === selectedId}>{item.label}</ItemLabel>
        </ListItem>
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
`;

const ListItem = styled.div`
  position: relative;
  padding: 14px 16px;
  border: 3px solid ${props => props.isInverted ? '#ffffff' : '#000000'};
  background: ${props => {
    if (props.isSelected) {
      return props.isInverted ? '#ffffff' : '#000000';
    }
    return props.isInverted ? '#00000000' : '#ffffff00';
  }};
  cursor: ${props => props.hasClickHandler ? 'pointer' : 'default'};
  margin-top: -3px;
  transition:
    background 0.2s ease,
    border-color 800ms ease-in-out;
  z-index: ${props => props.isSelected ? 1 : 0};

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: ${props => props.isInverted ? '#ffffff' : '#000000'};
    z-index: 1;
  }
`;

const ItemLabel = styled.span`
  font-family: 'Space Mono', monospace;
  font-size: 18px;
  font-weight: 400;
  color: ${props => {
    if (props.isSelected) {
      return props.isInverted ? '#000000' : '#ffffff';
    }
    return props.isInverted ? '#ffffff' : '#000000';
  }};
  transition: color 800ms ease-in-out, color 0.2s ease;

  ${ListItem}:hover & {
    color: ${props => props.isInverted ? '#000000' : '#ffffff'};
  }
`;

export default ExampleList;
