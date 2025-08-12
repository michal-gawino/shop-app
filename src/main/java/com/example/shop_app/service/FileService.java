package com.example.shop_app.service;

import com.example.shop_app.config.UploadProperties;
import jakarta.activation.MimetypesFileTypeMap;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.filefilter.PrefixFileFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private UploadProperties uploadProperties;

    public String getAvatar(String userId) {
        File f = getAvatarFile(userId);
        return Optional.ofNullable(f).map(file -> {
            byte[] fileContent = null;
            String mimeType = null;
            Path path = file.toPath();
            try {
                fileContent = Files.readAllBytes(path);
                mimeType = Optional.ofNullable(Files.probeContentType(path)).orElse(MimeTypeUtils.APPLICATION_OCTET_STREAM_VALUE);
            } catch (Exception ex) {
                return null;
            }
            return "data:%s;base64,%s".formatted(mimeType, Base64.encodeBase64String(fileContent));

        }).orElse(null);
    }

    public void uploadAvatar(String userId, MultipartFile multipartFile) throws IOException {
        File avatarFile = getAvatarFile(userId);
        Optional.ofNullable(avatarFile).map(File::delete);
        String extension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());
        String fileName = String.join(".", userId, extension);
        Path filepath = Path.of(uploadProperties.getAvatarFolder().getAbsolutePath(), fileName);
        Files.write(filepath, multipartFile.getBytes(), StandardOpenOption.CREATE);
    }

    private File getAvatarFile(String userId) {
        FileFilter filter = new PrefixFileFilter(userId);
        File avatarFolder = uploadProperties.getAvatarFolder();
        File[] files = avatarFolder.listFiles(filter);
        if (files != null && files.length > 0) {
            return files[0];
        }
        return null;
    }
}
