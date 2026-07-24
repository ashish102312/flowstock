package com.wareflow.inventory.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ topology for the Inventory domain.
 *
 * Exchange strategy: Topic exchange allows fine-grained routing.
 *   inventory.events  (topic exchange)
 *     ├── inventory.low-stock    → low-stock.queue
 *     ├── inventory.reserved     → reservation.queue
 *     └── inventory.released     → reservation.queue
 */
@Configuration
public class RabbitMQConfig {

    // ── Exchange ─────────────────────────────────────────────────────────────────
    public static final String INVENTORY_EXCHANGE     = "inventory.events";

    // ── Routing Keys ─────────────────────────────────────────────────────────────
    public static final String LOW_STOCK_ROUTING_KEY  = "inventory.low-stock";
    public static final String RESERVED_ROUTING_KEY   = "inventory.reserved";
    public static final String RELEASED_ROUTING_KEY   = "inventory.released";

    // ── Queues ───────────────────────────────────────────────────────────────────
    public static final String LOW_STOCK_QUEUE        = "low-stock.queue";
    public static final String RESERVATION_QUEUE      = "reservation.queue";

    @Bean
    public TopicExchange inventoryExchange() {
        return ExchangeBuilder.topicExchange(INVENTORY_EXCHANGE).durable(true).build();
    }

    @Bean
    public Queue lowStockQueue() {
        return QueueBuilder.durable(LOW_STOCK_QUEUE).build();
    }

    @Bean
    public Queue reservationQueue() {
        return QueueBuilder.durable(RESERVATION_QUEUE).build();
    }

    @Bean
    public Binding lowStockBinding() {
        return BindingBuilder.bind(lowStockQueue()).to(inventoryExchange()).with(LOW_STOCK_ROUTING_KEY);
    }

    @Bean
    public Binding reservedBinding() {
        return BindingBuilder.bind(reservationQueue()).to(inventoryExchange()).with(RESERVED_ROUTING_KEY);
    }

    @Bean
    public Binding releasedBinding() {
        return BindingBuilder.bind(reservationQueue()).to(inventoryExchange()).with(RELEASED_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
