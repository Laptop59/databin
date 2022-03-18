import App from '../App';
import ReactDom from 'react-dom';

it('checks the app structure', () => {
    let app = <App />;
    const div = document.createElement('div');
    ReactDom.render(app, div);

    const dba = div.childNodes[0];
    expect(dba.classList.value).toBe('DataBinApp');

    // Sub-app divs

    // Ribbon Checks.
    const dbr = dba.childNodes[0];
    expect(dbr.classList.value).toBe('DataBinRibbon');

    expect(dbr.childNodes[0].classList.value).toBe('DataBinTitleWrapper');
    expect(dbr.childNodes[0].childNodes[0].classList.value).toBe('DataBinTitle');
    expect(dbr.childNodes[0].childNodes[0].innerHTML).toBe('DataBin');

    expect(dbr.childNodes[1].classList.value).toBe('DataBinTabs');
    expect(dbr.childNodes[1].childNodes[0].classList.value).toBe('DataBinTabsWrapper');

    // Toolbox Checks.
    const dbt = dba.childNodes[1];

    expect(dbt.classList.value).toBe('DataBinToolbox');
    expect(dbt.childElementCount).toBe(5);
    expect(dbt.childNodes[1].classList.value).toBe('selectedType');

    // Structure Checks.
    const dbs = dba.childNodes[2];
    expect(dbs.classList.value).toBe('DataBinStructure');
    const dbsc = dbs.childNodes[0];
    expect(dbsc.classList.value).toBe('DataBinStructureContent');
    const dbst = dbsc.childNodes[0];
    expect(dbst.classList.value).toBe('DataBinStructureTag');

    expect(dbst.childNodes[0].classList.value).toBe('DataBinStructureTagIcon');
    expect(dbst.childNodes[1].classList.value).toBe('DataBinStructureTagName');
    expect(dbst.childNodes[1].innerHTML).toBe('Untitled: <div class="DataBinStructureIndented"></div>');

    // Final Checks.
    expect(dba.childNodes[3].id).toBe('DataBinInputFileButton');
});