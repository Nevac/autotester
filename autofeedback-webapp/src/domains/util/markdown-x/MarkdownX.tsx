import React, {ReactNode} from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/default-highlight";
import 'highlight.js/styles/vs2015.css';
import {atomOneDark} from "react-syntax-highlighter/dist/cjs/styles/hljs";

interface MarkDownXProperties {
    children?: ReactNode;
}

export default function MarkdownX(props: MarkDownXProperties) {
    return (
        <Markdown
            components={{
                code({node, className, children, ...props}) {
                    return (
                        <SyntaxHighlighter
                            style={atomOneDark}
                            language={"java"}
                            PreTag="div"
                            showLineNumbers
                        >
                            {String(children)}
                        </SyntaxHighlighter>
                    );
                }
            }}
        >
            {String(props.children)}
        </Markdown>
    )
}