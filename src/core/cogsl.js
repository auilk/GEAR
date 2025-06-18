function Tokenise(src)
{
    const tokens = [];
    const len = src.length;
    const stopAt = new Set(['\n', ' ', '+', '-', '*', '/', '=', ';']);

    let start = 0;
    let end = 0;
    while (start < len)
    {
        while(end < len && !stopAt.has(src[end])) end++;

        const value = src.substring(start, start === end ? ++end : end);

        let type;
        if (value === '+')
        {
            type = "ADDITION";
        }
        else if(value === '-')
        {
            type = "SUBSTRACTION";
        }
        else if(value === '*')
        {
            type = "MULTIPLICATION";
        }
        else if(value === '/')
        {
            type = "DIVISION";
        }
        if (value === '=')
        {
            type = "EQUAL";
        }
        else if (value === ';')
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
        else if (!(value[0] >= '0' && value[0] <= '9'))
        {
            for (let i = 0; i < value.length; i++)
            {
                let ch = value[i];
                if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch === '_')
                {
                    type = "IDENTIFIER";
                }
                else
                {
                    type = "UNKNOWN";
                    break;
                }
            }
        }
        else
        {
            type = "UNKNOWN";
        }

        tokens.push({ type: type, value: value});

        start = src[end] === ' '  || src[end] === '\n' ? ++end : end;
    }

    return tokens;
}