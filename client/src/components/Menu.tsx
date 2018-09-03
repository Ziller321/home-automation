import * as React from 'react';
import styled from 'styled-components'

const MenuWrapper = styled.div`
  display: flex;
  background: rgba(0,0,0,0.4);
  width: 100px;
  flex-direction: column;
`;

const MenuItem = styled.div`
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-content: center;

  border-bottom: 1px solid white;
  color: white;
  flex-direction: column;
  text-align: center;
`;


export const Menu: React.SFC<{}> = () => (
  <MenuWrapper>
    <MenuItem>
      <div>
        Valot
      </div>
    </MenuItem>
    <MenuItem>
      <div>
        Apple TV
      </div>
    </MenuItem>
  </MenuWrapper>
)