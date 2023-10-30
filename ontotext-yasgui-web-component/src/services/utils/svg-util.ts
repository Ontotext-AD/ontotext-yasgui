export class SvgUtil {
  static getLoaderSvgTag(size = '70'): string {
    return `<svg height=${size} width=${size} xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" preserveAspectRatio="xMinYMin" viewBox="0 0 50 50" id="svg2" version="1.1" inkscape:version="0.48.0 r9654" sodipodi:docname="namesvg.svg"><circle cx="21.5" cy="7.5" r="1.5" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0s" values="1.5; 3; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5" attributeType="XML" attributeName="r"/></circle><circle cx="31" cy="10" r="4" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.15s" values="4; 8; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4" attributeType="XML" attributeName="r"/></circle><circle cx="37" cy="15" r="2" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.3s" values="2; 4; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2" attributeType="XML" attributeName="r"/></circle><circle cx="40.5" cy="23.5" r="4.5" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.45s" values="4.5; 9; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5; 4.5" attributeType="XML" attributeName="r"/></circle><circle cx="39" cy="33" r="3" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.6s" values="3; 6; 3; 3; 3; 3; 3; 3; 3; 3; 3; 3; 3" attributeType="XML" attributeName="r"/></circle><circle cx="34.5" cy="38.5" r="1.5" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.75s" values="1.5; 3; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5; 1.5" attributeType="XML" attributeName="r"/></circle><circle cx="29" cy="42" r="2" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="0.9s" values="2; 4; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2" attributeType="XML" attributeName="r"/></circle><circle cx="21.5" cy="42.5" r="2.5" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.05s" values="2.5; 5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5" attributeType="XML" attributeName="r"/></circle><circle cx="12" cy="39" r="4" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.2s" values="4; 8; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4" attributeType="XML" attributeName="r"/></circle><circle cx="7" cy="32" r="2" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.35s" values="2; 4; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2; 2" attributeType="XML" attributeName="r"/></circle><circle cx="5.5" cy="25.5" r="2.5" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.5s" values="2.5; 5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5; 2.5" attributeType="XML" attributeName="r"/></circle><circle cx="8" cy="16" r="4" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.65s" values="4; 8; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4; 4" attributeType="XML" attributeName="r"/></circle><circle cx="14" cy="10" r="3" fill="#ff3900"><animate repeatCount="indefinite" dur="2s" begin="1.8s" values="3; 6; 3; 3; 3; 3; 3; 3; 3; 3; 3; 3; 3" attributeType="XML" attributeName="r"/></circle></svg>`;
  }

  static getPivotTableIconSvgTag(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M400-640v-200h360q33 0 56.5 23.5T840-760v120H400ZM200-120q-33 0-56.5-23.5T120-200v-360h200v440H200Zm-80-520v-120q0-33 23.5-56.5T200-840h120v200H120ZM520-80 360-240l160-160 56 56-62 64h86q33 0 56.5-23.5T680-360v-88l-64 64-56-56 160-160 160 160-56 56-64-64v88q0 66-47 113t-113 47h-86l62 64-56 56Z"/>
      </svg>`;
  }

  static getYasrChartPluginIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-640h80v640h640v80H200Zm40-120v-360h160v360H240Zm200 0v-560h160v560H440Zm200 0v-200h160v200H640Z"/>
      </svg>`;
  }

  static getPivotTableValueIcon(height = 14, width= 14): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}">
                <path d="M480-80 310-250l57-57 73 73v-206H235l73 72-58 58L80-480l169-169 57 57-72 72h206v-206l-73 73-57-57 170-170 170 170-57 57-73-73v206h205l-73-72 58-58 170 170-170 170-57-57 73-73H520v205l72-73 58 58L480-80Z"/>
            </svg>`;
  }
}
