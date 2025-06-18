function Tokenise(src)
{
    const tokens = [];
    const len = src.length;
    const stopAt = new Set(['\n', ' ', '+', '-', '*', '/', '=', ';']);

    let start = 0;
    let end = 0;
    while (start < len)
    {
        while (src[start] === ' ' || start[start] === '\n') start++;
        end = start;
        while(end < len && !stopAt.has(src[end])) end++;

        const value = src.substring(start, start === end ? ++end : end);

        let type;
        if (value === '+')
        {
            type = "ADDITION";
        }
        else if(value === '-')
        {
            type = "SUBTRACTION";
        }
        else if(value === '*')
        {
            type = "MULTIPLICATION";
        }
        else if(value === '/')
        {
            type = "DIVISION";
        }
        else if (value === '=')
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

function Parse(tokens)
{
    const output = [];
    let i = 0;


    const ParsePrimary = (tokens) =>
    {
        if (tokens[i].type === "IDENTIFIER" || tokens[i].type === "INT_LITERAL" || tokens[i].type === "FLOAT_LITERAL")
        {
            return tokens[i++].value;
        }
    }

    const ParseAddition = (tokens) =>
    {
        let left = ParsePrimary(tokens);

        while (tokens[i].type === "ADDITION" || tokens[i].type === "SUBTRACTION")
        {
            const operator = tokens[i++].value;
            const right = ParsePrimary(tokens);
            left = `(${left} ${operator} ${right})`;
        }
        
        return left;
    }

    const ParseExpresion = (tokens) =>
    {
        return ParseAddition(tokens);
    }

    while (i < tokens.length)
    {
        let typeToken;
        if (tokens[i].type === "KEYWORD") typeToken = tokens[i++];
        const varType = typeToken.value;

        let idToken;
        if (tokens[i].type === "IDENTIFIER") idToken = tokens[i++];
        const varId = idToken.value;

        if (tokens[i].type === "EQUAL") i++;

        let varExpr = ParseExpresion(tokens);

        while (i < tokens.length) if (tokens[i].type === "SEMI_COLON") i++;

        output.push(`${varType} ${varId} = ${varExpr};`);
    }

    return output.join('\n');
}

const tokens = Tokenise("   int x = 5;;;;");
console.log(Parse(tokens));