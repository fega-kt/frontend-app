import { Icon } from '@/components/icon';
import { themeVars } from '@/theme/theme.css';
import { Text } from '@/ui/typography';
import { fBytes } from '@/utils/format-number';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { StyledUploadAvatar } from './styles';
import { getBlobUrl } from './utils';
import { compact } from 'lodash';

interface Props extends UploadProps {
  defaultAvatar?: string;
  helperText?: React.ReactElement | string;
}

export interface SingleUploadAvatarRef {
  clear: () => void;
  getFile: () => UploadFile | undefined;
  getImageUrl: () => string;
}

export const SingleUploadAvatar = forwardRef<SingleUploadAvatarRef, Props>(
  ({ helperText, defaultAvatar = '', ...other }, ref) => {
    const [imageUrl, setImageUrl] = useState<string>(defaultAvatar);
    const [file, setFile] = useState<UploadFile>();
    const [isHover, setIsHover] = useState(false);

    const handelHover = (hover: boolean) => setIsHover(hover);

    const clear = useCallback(() => {
      setFile(undefined);
      setImageUrl('');
    }, []);

    const getFile = useCallback(() => file, [file]);

    const getImageUrl = useCallback(() => imageUrl, [imageUrl]);

    useImperativeHandle(
      ref,
      () => ({
        clear,
        getFile,
        getImageUrl,
      }),
      [clear, getFile, getImageUrl]
    );

    const renderPreview = (
      <img src={imageUrl} alt="" className="absolute rounded-full" />
    );

    const renderPlaceholder = (
      <div
        style={{
          backgroundColor:
            !imageUrl || isHover
              ? themeVars.colors.background.neutral
              : 'transparent',
        }}
        className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
      >
        <Icon icon="solar:camera-add-bold" size={32} />
        <div className="mt-1 text-xs">Upload Photo</div>
      </div>
    );

    const renderContent = (
      <div
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
        onMouseEnter={() => handelHover(true)}
        onMouseLeave={() => handelHover(false)}
      >
        {imageUrl ? renderPreview : null}
        {!imageUrl || isHover ? renderPlaceholder : null}
      </div>
    );

    const defaultHelperText = (
      <Text variant="caption" color="secondary">
        Allowed *.jpeg, *.jpg, *.png, *.gif
        <br /> max size of {fBytes(3145728)}
      </Text>
    );

    const renderHelpText = (
      <div className="text-center">{helperText || defaultHelperText}</div>
    );

    const props: UploadProps = {
      onRemove: () => {
        setFile(undefined);
        setImageUrl('');
      },
      beforeUpload: (file) => {
        setFile(file);
        setImageUrl(getBlobUrl(file));
        return false;
      },
      fileList: compact([file]),
    };

    return (
      <StyledUploadAvatar>
        <Upload
          name="avatar"
          showUploadList={false}
          listType="picture-circle"
          className="avatar-uploader flex! items-center justify-center"
          {...other}
          {...props}
          maxCount={1}
          multiple={false}
        >
          {renderContent}
        </Upload>
        {renderHelpText}
      </StyledUploadAvatar>
    );
  }
);

SingleUploadAvatar.displayName = 'SingleUploadAvatar';
