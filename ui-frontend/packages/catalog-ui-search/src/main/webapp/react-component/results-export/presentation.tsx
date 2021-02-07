/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
const { Menu, MenuItem } = require('../menu')
const Dropdown = require('../dropdown')
import GetAppIcon from '@material-ui/icons/GetApp'

const Root = styled.div`
  padding: ${(props) => props.theme.largeSpacing};

  button {
    margin-top: ${(props) => props.theme.minimumSpacing};
    width: 100%;
  }

  .export-option {
    margin-bottom: ${(props) => props.theme.minimumSpacing};
  }
`

type ExportFormat = {
  id: string
  displayName: string
}

type Props = {
  selectedFormat: string
  exportFormats: ExportFormat[]
  encryptionMode: boolean
  downloadDisabled: boolean
  onDownloadClick: () => void
  handleExportOptionChange: () => void
  handleEncryptionOptionChange: () => void
}

const ResultsExport = (props: Props) => {
  const {
    selectedFormat,
    exportFormats,
    encryptionMode,
    downloadDisabled,
    onDownloadClick,
    handleExportOptionChange,
    handleEncryptionOptionChange,
  } = props
  var actualExportFormats = exportFormats
  actualExportFormats = [
    { id: 'tdf', displayName: 'TDF' },
    { id: 'stanag', displayName: 'STANAG' },
  ]

  return (
    <Root>
      <div data-id="export-format-select" className="export-option">
        <p>Export Format:</p>
        <Dropdown label={selectedFormat}>
          <Menu value={selectedFormat} onChange={handleExportOptionChange}>
            {actualExportFormats.map((option) => (
              <MenuItem key={option.id} value={option.displayName} />
            ))}
          </Menu>
        </Dropdown>
      </div>
      <FormControlLabel
        labelPlacement="end"
        control={
          <Checkbox
            color="default"
            checked={encryptionMode}
            onChange={handleEncryptionOptionChange}
          />
        }
        label="Encrypt"
      />
      <Button
        className="export-button"
        variant="contained"
        color="primary"
        data-id="download-export-button"
        disabled={downloadDisabled}
        onClick={onDownloadClick}
      >
        <GetAppIcon /> Export
      </Button>
    </Root>
  )
}

export default hot(module)(ResultsExport)
