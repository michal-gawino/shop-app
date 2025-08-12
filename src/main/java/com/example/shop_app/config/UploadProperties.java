package com.example.shop_app.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
@ConfigurationProperties(prefix = "upload")
@Data
public class UploadProperties {

    private File avatarFolder;
}
