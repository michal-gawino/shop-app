package com.example.shop_app.service;

import com.example.shop_app.config.UploadProperties;
import org.apache.commons.io.filefilter.PrefixFileFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private UploadProperties uploadProperties;

    public void uploadAvatar(String id, MultipartFile multipartFile) throws IOException {
        File avatarFile = getAvatarFile(id);
        Optional.ofNullable(avatarFile).map(File::delete);
        String extension = StringUtils.getFilenameExtension(multipartFile.getOriginalFilename());
        String fileName = String.join(".", id, extension);
        Path filepath = Path.of(uploadProperties.getAvatarFolder().getAbsolutePath(), fileName);
        Files.write(filepath, multipartFile.getBytes(), StandardOpenOption.CREATE);
    }

    public File getAvatarFile(String userId) {
        FileFilter filter = new PrefixFileFilter(userId);
        File avatarFolder = uploadProperties.getAvatarFolder();
        File[] files = avatarFolder.listFiles(filter);
        if (files != null && files.length > 0) {
            return files[0];
        }
        return null;
    }
}
