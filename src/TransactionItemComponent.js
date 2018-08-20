import React from 'react';
import moment from 'moment';

const TransactionItemComponent = ({transaction}) => {
    const formattedTimeStamp = moment(transaction.timestamp).format('MM/DD/YYYY');

    return (
        <div className="transaction-rows">
            {decoratedSpan(formattedTimeStamp, "column-timestamp")}
            {decoratedSpan(transaction.from, "column-hash")}
            {decoratedSpan(transaction.to, "column-hash")}
            {decoratedSpan(transaction.hash, "column-hash")}
            {decoratedSpan(transaction.value, "column-value")}
        </div>
    )
};

const decoratedSpan = (content, className) => {
    return (
        <span className={className} datatext={content}>{content}</span>
    )
};

export default TransactionItemComponent