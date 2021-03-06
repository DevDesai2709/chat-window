import React, {useEffect, useState, useRef} from "react";
import {autorun} from "mobx";
import {ChatBubbleParams} from "../../types";
import {BubbleContentContainer} from "./BubbleContentContainer";
import Loading from "./loading/Loading";
import ImageContainer from "./ImageContainer";
import Image from "./Image";
import BubbleImageContainer from "./BubbleImageContainer";
import {getAsMessageContent} from "../utils/getAsMessageContent";

export const ChatBubble = (p: ChatBubbleParams) => {
    const avatar = p.entry.avatar;
    const {isRtl} = p;
    const [id, setId] = useState(p.entry.id);
    const [messages, setMessage] = useState(getAsMessageContent(p.entry.message));
    const [isLoading, setIsLoading] = useState(!!p.entry.isLoading);
    const [isUser, setIsUser] = useState(p.entry.isUser);
    const [isFirst, setIsFirst] = useState(true);
    const [isLast, setIsLast] = useState(true);
    const [bubbles, setBubbles] = useState<JSX.Element[]>();

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => autorun(() => setIsLoading(!!p.entry.isLoading)), []);
    useEffect(() => {
        setId(p.entry.id);
    }, [p.entry.id]);
    useEffect(() => {
        renderBubbles();
    }, [p.entry.message]);
    useEffect(() => {
        setIsUser(p.entry.isUser);
    }, [p.entry.isUser]);

    useEffect(() => {
        setIsFirst(true); // this is here for future implementation
        setIsLast(true);
    }, []);

    useEffect(
        () =>
            autorun(() => {
                setMessage(getAsMessageContent(p.entry.message));
                const r = ref.current && ref.current.parentElement ? ref.current.parentElement : undefined;
                r &&
                    setTimeout(
                        () =>
                            r.scrollTo({
                                top: r.scrollHeight,
                                behavior: "smooth",
                            }),
                        1000 // this is a hack to bypass animation delay. Without it, container doesn't scroll all the way when changing bot response from loading to message
                    );
            }),
        []
    );

    const renderBubbles = () => {
        if (isLoading) {
            const loading = (
                <BubbleContentContainer id={id} isUser={isUser} isFirst={isFirst} isLast={isLast}>
                    <Loading />
                </BubbleContentContainer>
            );

            setBubbles([loading]);
        } else {
            const bubbles = messages.map((msg, i) => {
                const msgText =
                    msg.text !== "" ? (
                        <BubbleContentContainer
                            id={id}
                            isUser={isUser}
                            isFirst={isFirst}
                            isLast={isLast}
                            key={`c_${i}`}>
                            {msg.text}
                        </BubbleContentContainer>
                    ) : (
                        ""
                    );

                const msgImage = !!msg.image ? (
                    <BubbleImageContainer src={msg.image as string} key={`image_${i}`} />
                ) : (
                    ""
                );

                return (
                    <>
                        {msgText}
                        {msgImage}
                    </>
                );
            });

            setBubbles(bubbles);
        }
    };

    return (
        <div
            ref={ref}
            style={{
                alignItems: "flex-end",
                display: "flex",
                justifyContent: `${isUser ? "flex-end" : "flex-start"}`,
            }}>
            <ImageContainer isUser={isUser}>
                <Image isUser={isUser} src={avatar} />
            </ImageContainer>
            <div
                style={{
                    direction: isRtl ? "rtl" : "ltr",
                    textAlign: isRtl ? "right" : "left",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "end" : "start",
                    maxWidth: "calc( 100% - 104px )",
                }}>
                {bubbles && bubbles.map((b, i) => <div key={`bubble_inner_${i}`}>{b}</div>)}
            </div>
            {p.endElement}
        </div>
    );
};
