function Tokenise(src)
{
    const tokens = [];
    const maxInt = Number.MAX_SAFE_INTEGER;
    const len = src.length;

    let start = 0;
    let end = 0;
    while (start < len)
    {
        if (src[start] === " " || src[start] === '\n')
        {
            start++;
        }
        else
        {
            let space = src.indexOf(" ", start);
            let equal = src.indexOf("=", start);
            let semicolon = src.indexOf(";", start);
    
            space = space === -1 ? maxInt : space;
            equal = equal === -1 ? maxInt : equal;
            semicolon = semicolon === -1 ? maxInt : semicolon;

            end = Math.min(space, equal, semicolon);
            end = end === maxInt ? src.length : end;
            end = start === end ? end + 1 : end;
    
            const value = src.substring(start, end);
    
            let type;
            if (value === "=")
            {
                type = "EQUAL";
            }
            else if (value === ";")
            {
                type = "SEMI_COLON";
            } 
            else if (value === "int" || value === "float")
            {
                type = "KEYWORD";
            } 
            else if (!isNaN(value)) 
            {
                type = Number.isInteger(Number(value)) ? "INT_LITERAL" : "FLOAT_LITERAL";
            } 
            else 
            {
                type = "IDENTIFIER";
            }
    
            tokens.push({ type: type, value: value});
    
            start = end;
        }
    }

    return tokens;
}