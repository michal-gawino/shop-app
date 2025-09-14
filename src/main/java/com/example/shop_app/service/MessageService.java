package com.example.shop_app.service;

import com.example.shop_app.dto.ChatMessage;
import com.example.shop_app.dto.User;
import com.example.shop_app.entity.Message;
import com.example.shop_app.repository.MessageRepository;
import com.example.shop_app.search.UserChatHistory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.MongoExpression;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class MessageService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserService userService;

    public Message save(ChatMessage message) {
        Message m = new Message(message.senderId(), message.chatId(), message.content(), message.date(), message.users());
        return messageRepository.save(m);
    }

    public List<UserChatHistory> getUserChatHistory() {
        User currentUser = userService.getCurrentUser();
        ProjectionOperation projectionOperation = project("chatId", "date", "messages")
                .and("_id").as("chatId")
                .andExclude(Fields.UNDERSCORE_ID);

        ArrayOperators.SortArray sortArray = ArrayOperators.SortArray.sortArrayOf("messages").by(Sort.by(Sort.Direction.DESC, "date"));

        ProjectionOperation sortArrayProjection = project("messages", "chatId").and(sortArray).as("messages");
        MatchOperation matchOperation = match(Criteria.where("users").is(currentUser.id()));
        GroupOperation groupOperation = group("chatId").push("$$ROOT").as("messages").max("date").as("date");
        SortOperation sortOperation = sort(Sort.Direction.DESC, "date");
        Aggregation aggregation = newAggregation(matchOperation, groupOperation, projectionOperation,sortArrayProjection, sortOperation);


        AggregationResults<UserChatHistory> aggregationResults = mongoTemplate.aggregate(aggregation, Message.class, UserChatHistory.class);
        List<UserChatHistory> results = aggregationResults.getMappedResults();
        results.forEach(r -> {
            ChatMessage first = r.getMessages().getFirst();
            first.users().remove(currentUser.id());
            String user = first.users().getFirst();
            r.setUser(userService.getById(user));
        });
        return results;
    }

}
