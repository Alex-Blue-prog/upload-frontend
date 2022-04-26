import styled from 'styled-components';

export const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Content = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 30px;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
`;

export const LimitContainer = styled.div`
    margin-bottom: 1rem;
    position: absolute;
    top: 20px;
`

export const LimitText = styled.p`
    color: #fff;
    font-family: 'Times New Roman', Times, serif;
    letter-spacing: 1px;
    text-shadow: 1px 1px 0px purple;
    font-weight: 600;
    font-size: 1.1rem;
`