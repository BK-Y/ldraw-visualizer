/// <reference path="../../typings/references.ts" />
/// <reference path="./LdrawFile.ts" />
/// <reference path="../utility.ts" />
/// <reference path="./lines/CommentLine.ts" />
/// <reference path="./lines/LdrawFileLine.ts" />
/// <reference path="./lines/LineLine.ts" />
/// <reference path="./lines/LineTypes.ts" />
/// <reference path="./lines/OptionalLineLine.ts" />
/// <reference path="./lines/QuadrilateralLine.ts" />
/// <reference path="./lines/SubFileReferenceLine.ts" />
/// <reference path="./lines/TriangleLine.ts" />
/// <reference path="./lines/meta-lines/METALine.ts" />
/// <reference path="./lines/meta-lines/AuthorMETALine.ts" />
/// <reference path="./lines/meta-lines/ColourMETALine.ts" />
/// <reference path="./lines/meta-lines/NameMETALine.ts" />
/// <reference path="./lines/meta-lines/PartDescription.ts" />
/// <reference path="./lines/meta-lines/RotationCenterMETALine.ts" />
/// <reference path="./lines/meta-lines/RotationConfigMETALine.ts" />
/// <reference path="./lines/meta-lines/StepMETALine.ts" />
/// <reference path="./lines/meta-lines/RotationStepMETALine.ts" />
var LdrawVisualizer;
(function (LdrawVisualizer) {
    var Parser;
    (function (Parser) {
        var FileParser = (function () {
            function FileParser() {
            }
            FileParser.Parse = function (fileContent) {
                var partFile = new LdrawVisualizer.LdrawFile();
                var lines = fileContent.split(/\r?\n/g);
                lines.forEach(function (line, lineNumber) {
                    if (!/$\s*^/.test(line)) {
                        var splitLine = line.trim().split(/\s+/g);
                        switch (splitLine[0]) {
                            // Comment or META command
                            case '0':
                                // first, try and parse as a META command
                                var metaLine = Parser.Lines.METALine.Parse(line, splitLine, lineNumber);
                                // if theabove returned null, we either have a comment field or an unimplemented META command
                                if (!metaLine) {
                                    partFile.Lines.push(Parser.Lines.CommentLine.Parse(line, splitLine, lineNumber));
                                }
                                else {
                                    partFile.Lines.push(metaLine);
                                }
                                break;
                            // Subfile reference
                            case '1':
                                partFile.Lines.push(Parser.Lines.SubFileReferenceLine.Parse(line, splitLine, lineNumber));
                                break;
                            // Line
                            case '2':
                                partFile.Lines.push(Parser.Lines.LineLine.Parse(line, splitLine, lineNumber));
                                break;
                            // Triangle
                            case '3':
                                partFile.Lines.push(Parser.Lines.TriangleLine.Parse(line, splitLine, lineNumber));
                                break;
                            // Quadrilateral
                            case '4':
                                partFile.Lines.push(Parser.Lines.QuadrilateralLine.Parse(line, splitLine, lineNumber));
                                break;
                            // Optional Line
                            case '5':
                                partFile.Lines.push(Parser.Lines.OptionalLineLine.Parse(line, splitLine, lineNumber));
                                break;
                            case '6':
                                throw 'Unable to parse file: unknown line type: "' + splitLine[0] + '" on line ' + lineNumber;
                        }
                    }
                });
                return partFile;
            };
            return FileParser;
        })();
        Parser.FileParser = FileParser;
    })(Parser = LdrawVisualizer.Parser || (LdrawVisualizer.Parser = {}));
})(LdrawVisualizer || (LdrawVisualizer = {}));
//# sourceMappingURL=FileParser.js.map