package com.flowstock.discovery;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DiscoveryServiceApplicationTests {

    @Autowired
    private TestRestTemplate rest;

    @Test
    void contextLoads() {
        // sanity check - context starts
    }

    @Test
    void healthEndpointReturnsUp() {
        ResponseEntity<String> resp = rest.getForEntity("/actuator/health", String.class);
        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resp.getBody()).contains("UP");
    }

    @Test
    void eurekaAppsEndpointAccessible() {
        ResponseEntity<String> resp = rest.getForEntity("/eureka/apps", String.class);
        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        // response may be XML or JSON; ensure it contains expected envelope
        assertThat(resp.getBody()).satisfiesAnyOf(
                body -> assertThat(body).contains("applications"),
                body -> assertThat(body).contains("<applications")
        );
    }

    @Test
    void dashboardHtmlLoads() {
        ResponseEntity<String> resp = rest.getForEntity("/", String.class);
        assertThat(resp.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(resp.getBody()).containsIgnoringCase("eureka");
    }
}
