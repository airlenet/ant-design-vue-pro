<template>
  <div :class="[styles.coverCardList]">
    <a-card :bordered="false">
      <a-form layout="inline">
        <StandardFormRow
          title="所属类目"
          block
          :style="{
            paddingBottom: '11px'
          }"
        >
          <a-form-item name="category">
            <TagSelect expandable>
              <TagSelectOption value="cat1">类目一</TagSelectOption>
              <TagSelectOption value="cat2">类目二</TagSelectOption>
              <TagSelectOption value="cat3">类目三</TagSelectOption>
              <TagSelectOption value="cat4">类目四</TagSelectOption>
              <TagSelectOption value="cat5">类目五</TagSelectOption>
              <TagSelectOption value="cat6">类目六</TagSelectOption>
              <TagSelectOption value="cat7">类目七</TagSelectOption>
              <TagSelectOption value="cat8">类目八</TagSelectOption>
              <TagSelectOption value="cat9">类目九</TagSelectOption>
              <TagSelectOption value="cat10">类目十</TagSelectOption>
              <TagSelectOption value="cat11">类目十一</TagSelectOption>
              <TagSelectOption value="cat12">类目十二</TagSelectOption>
            </TagSelect>
          </a-form-item>
        </StandardFormRow>
        <StandardFormRow title="其它选项" grid last>
          <a-row :gutter="16">
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item v-bind="formItemLayout" label="作者" name="author">
                <a-select
                  placeholder="不限"
                  :style="{
                    maxWidth: '200px',
                    width: '100%'
                  }"
                >
                  <a-select-option value="lisa">王昭君</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8" :md="10" :sm="10" :xs="24">
              <a-form-item v-bind="formItemLayout" label="好评度" name="rate">
                <a-select
                  placeholder="不限"
                  :style="{
                    maxWidth: '200px',
                    width: '100%'
                  }"
                >
                  <a-select-option value="good">优秀</a-select-option>
                  <a-select-option value="normal">普通</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </StandardFormRow>
      </a-form>
    </a-card>

    <div :class="[styles.cardList]">
      <a-list
        rowKey="id"
        :loading="loading"
        :grid="{
          gutter: 24,
          xl: 4,
          lg: 3,
          md: 3,
          sm: 2,
          xs: 1
        }"
        :dataSource="list"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="item, index"
          :key="index + item.id"
        >
          <a-card :class="[styles.card]" hoverable>
            <img slot="cover" :alt="item.title" :src="item.cover" />
            <a-card-meta>
              <a slot="title">{{ item.title }}</a>
              <div
                slot="description"
                class="ant-typography ant-typography-ellipsis ant-typography-ellipsis-multiple-line"
                style="-webkit-line-clamp: 2;"
              >
                {{ item.subDescription }}
              </div>
              <!--<Paragraph -->
              <!--className={styles.item}-->
              <!--:ellipsis="{-->
              <!--rows: 2,-->
              <!--}"-->
              <!--&gt;-->
              <!---->
              <!--</Paragraph>-->
            </a-card-meta>
            <div :class="[styles.cardItemContent]">
              <span> {{ format(item.updatedAt) }}</span>
              <div :class="[styles.avatarList]">
                <AvatarList size="small">
                  <AvatarListItem
                    v-for="(member, index) in item.members"
                    :key="`${item.id}-${index}`"
                    :src="member.avatar"
                    :tips="member.name"
                  ></AvatarListItem>
                </AvatarList>
              </div>
            </div>
          </a-card>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import styles from "./style.module.less";
import StandardFormRow from "@/components/StandardFormRow";
import TagSelect from "../../../../components/TagSelect/TagSelect";
import TagSelectOption from "../../../../components/TagSelect/TagSelectOption";
import { registerModel } from "./model.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/esm/plugin/relativeTime";
import AvatarList from "../../../../components/AvatarList/AvatarList";
import AvatarListItem from "../../../../components/AvatarList/AvatarListItem";
dayjs.extend(relativeTime);
export default {
  name: "Projects",
  components: {
    AvatarListItem,
    AvatarList,
    TagSelectOption,
    TagSelect,
    StandardFormRow
  },
  data() {
    return {
      styles,
      formItemLayout: {
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 16
          }
        }
      }
    };
  },
  created() {
    registerModel(this.$store);
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.models["listAndsearchAndprojects"];
    },
    list() {
      return this.$store.state["listAndsearchAndprojects"].list;
    }
  },
  mounted() {
    this.$store.dispatch({
      type: "listAndsearchAndprojects/fetch",
      payload: {
        count: 8
      }
    });
  },
  methods: {
    format(val) {
      return dayjs(val).fromNow();
    }
  }
};
</script>
<style>
.ant-typography p,
div.ant-typography {
  margin-bottom: 1em;
}
.ant-typography {
  color: rgba(0, 0, 0, 0.65);
}
.ant-typography-ellipsis-multiple-line {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
