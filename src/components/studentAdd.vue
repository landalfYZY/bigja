<template>
    <transition name="el-fade-in-linear">
        <div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem label="学校" prop="name">
                    <Select v-model="formValidate.schoolId" placeholder="选择学校" style="width:250px" >
                            <Option v-for="(item,index) in schoolList" :value="item.sunwouId" :key="index">{{ item.name }}</Option>
                        </Select>
                </FormItem>
                <FormItem label="学生姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="学生姓名" />
                </FormItem>
                <FormItem label="身份证号" prop="sunwouId">
                    <Input v-model="formValidate.sunwouId" placeholder="身份证号" />
                </FormItem>
                <FormItem label="入学年份" prop="schoolTime">
                    <Input v-model="formValidate.schoolTime"  placeholder="入学年份" />
                </FormItem>
                <FormItem label="班级" prop="cl">
                    <Input v-model="formValidate.cl" placeholder="班级" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">保存提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </div>
    </transition>
</template>
<script>
var that;
export default {
  data() {
    return {
      formValidate: {
        schoolId:"",
        sunwouId: "",
        name: "",
        schoolTime: "",
        cl: ""
      },
      schoolList:[],
      ruleValidate: {
        schoolId: [
          { required: true, message: "请选择一个学校", trigger: "blur" }
        ],
        name: [
          { required: true, message: "学生姓名不能为空", trigger: "blur" }
        ],
        sunwouId: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        schoolTime: [
          { required: true, trigger: "blur", message: "入学年份不能为空" }
        ],
        cl: [{ required: true, trigger: "blur", message: "班级不能为空" }]
      }
    };
  },
  mounted() {
    that = this;
    this.getSchool()
  },
  methods: {
      getSchool() {
      var query = {
            fields: [],
            wheres: [
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "createTime", asc: false }],
            pages: {
              currentPage: 1,
              size: 10000
            }
          }
      if(!JSON.parse(sessionStorage.getItem('user')).appid){
        query.wheres.push({value:'sunwouId',opertionType:'equal',opertionValue:JSON.parse(sessionStorage.getItem('user')).sunwouId})
      }
      $.ajax({
        url: sessionStorage.getItem("API") + "school/find",
        data: {
          query: JSON.stringify(query)
        },
        method: "post",
        dataType: "json",
        success(res) {
          if (res.code) {
            that.schoolList = res.params.msg;
          }
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          $.ajax({
            url: sessionStorage.getItem("API") + "user/add",
            data: that.formValidate,
            dataType: "json",
            method: "post",
            success(res) {
              if (res.code) {
                that.$Notice.success({
                  title: "学生添加成功",
                  desc: that.formValidate.name
                });
                that.$router.push({ path: "/student" });
              } else {
                that.$message.error(res.msg);
              }
            }
          });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>